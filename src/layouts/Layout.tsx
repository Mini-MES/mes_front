import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Shield, User, RefreshCw, LogOut } from 'lucide-react';
import { 
  AppContainer, 
  MainHeader, 
  LogoSection, 
  LogoIcon, 
  LogoText, 
  HeaderControls, 
  UserInfo, 
  RoleBadge, 
  ToggleButton, 
  LogoutButton,
  Main 
} from '@/layouts/Layout.styles';

const Layout: React.FC = () => {
  const { userRole, currentUser, logout, switchRole } = useApp();
  const navigate = useNavigate();

  const handleRoleToggle = () => {
    const nextRole = userRole === 'admin' ? 'worker' : 'admin';
    switchRole(nextRole);
    if (nextRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/worker');
    }
  };

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <AppContainer>
      <MainHeader>
        <LogoSection>
          <LogoIcon size={28} />
          <LogoText>ANTIGRAVITY MES</LogoText>
        </LogoSection>
        
        <HeaderControls>
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

          <ToggleButton onClick={handleRoleToggle}>
            <RefreshCw size={14} />
            {userRole === 'admin' ? '작업자 화면으로 전환' : '관리자 화면으로 전환'}
          </ToggleButton>

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
