import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useSignalRContext } from '@/context/SignalRContext';
import { useNotification } from '@/context/NotificationContext';
import NotificationDrawer from '@/components/common/notification/NotificationDrawer';
import { Shield, User, LogOut, Radio, Bell } from 'lucide-react';
import * as S from '@/layouts/Layout.styles';

const Layout: React.FC = () => {
  const { userRole, currentUser, logout } = useApp();
  const { connectionState } = useSignalRContext();
  const { unreadCount } = useNotification();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      navigate('/login');
    }
  };

  const getSignalRBadge = () => {
    switch (connectionState) {
      case 'Connected':
        return { text: '실시간 (SignalR)', color: '#00e676', border: 'rgba(0, 230, 118, 0.4)' };
      case 'Connecting':
        return { text: '연결 중...', color: '#ffb703', border: 'rgba(255, 183, 3, 0.4)' };
      case 'Reconnecting':
        return { text: '재연결 중...', color: '#ffb703', border: 'rgba(255, 183, 3, 0.4)' };
      default:
        return { text: '오프라인', color: '#ff4b5c', border: 'rgba(255, 75, 92, 0.4)' };
    }
  };

  const signalStatus = getSignalRBadge();

  return (
    <S.AppContainer>
      <S.MainHeader>
        <S.LogoSection>
          <S.LogoIcon size={28} />
          <S.LogoText>ANTIGRAVITY MES</S.LogoText>
        </S.LogoSection>

        <S.HeaderControls>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '20px',
              background: 'rgba(15, 23, 42, 0.6)',
              border: `1px solid ${signalStatus.border}`,
              fontSize: '12px',
              color: signalStatus.color,
              fontWeight: 600,
            }}
          >
            <Radio size={12} style={{ color: signalStatus.color }} />
            {signalStatus.text}
          </div>

          <S.NotificationBellButton
            onClick={() => setIsDrawerOpen(true)}
            aria-label="알림 센터 열기"
            title="알림 센터"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <S.BellBadge>{unreadCount > 99 ? '99+' : unreadCount}</S.BellBadge>
            )}
          </S.NotificationBellButton>

          <S.UserInfo>
            {userRole === 'admin' ? (
              <Shield size={16} className="role-badge admin" />
            ) : (
              <User size={16} className="role-badge worker" />
            )}
            <S.RoleBadge className={userRole}>
              {userRole === 'admin' ? '관리자 모드' : '작업자 모드'}
            </S.RoleBadge>
            <span style={{ fontWeight: 500 }}>
              {currentUser.name} ({currentUser.id})
            </span>
          </S.UserInfo>
          <S.LogoutButton onClick={handleLogout}>
            <LogOut size={14} />
            로그아웃
          </S.LogoutButton>
        </S.HeaderControls>
      </S.MainHeader>

      <NotificationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      <S.Main>
        <Outlet />
      </S.Main>
    </S.AppContainer>
  );
};

export default Layout;
