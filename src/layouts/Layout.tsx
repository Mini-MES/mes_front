import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useSignalRContext } from '@/context/SignalRContext';
import { Shield, User, LogOut, Radio } from 'lucide-react';
import { 
  AppContainer, 
  MainHeader, 
  LogoSection, 
  LogoIcon, 
  LogoText, 
  HeaderControls, 
  UserInfo, 
  RoleBadge, 
  LogoutButton,
  Main 
} from '@/layouts/Layout.styles';

const Layout: React.FC = () => {
  const { userRole, currentUser, logout } = useApp();
  const { connectionState } = useSignalRContext();
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
    <AppContainer>
      <MainHeader>
        <LogoSection>
          <LogoIcon size={28} />
          <LogoText>ANTIGRAVITY MES</LogoText>
        </LogoSection>
        
        <HeaderControls>
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
              fontWeight: 600
            }}
          >
            <Radio size={12} style={{ color: signalStatus.color }} />
            {signalStatus.text}
          </div>

          <UserInfo>
            {userRole === 'admin' ? (
              <Shield size={16} className="role-badge admin" />
            ) : (
              <User size={16} className="role-badge worker" />
            )}
            <RoleBadge className={userRole}>
              {userRole === 'admin' ? '관리자 모드' : '작업자 모드'}
            </RoleBadge>
            <span style={{ fontWeight: 500 }}>{currentUser.name} ({currentUser.id})</span>
          </UserInfo>
          <LogoutButton onClick={handleLogout}>
            <LogOut size={14} />
            로그아웃
          </LogoutButton>
        </HeaderControls>
      </MainHeader>

      <Main>
        <Outlet />
      </Main>
    </AppContainer>
  );
};

export default Layout;
