import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useApp } from '../context/AppContext';
import { Factory, Shield, User, RefreshCw } from 'lucide-react';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
  background: rgba(11, 15, 25, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid ${props => props.theme.colors.borderColor};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const LogoIcon = styled(Factory)`
  color: ${props => props.theme.colors.primary};
  filter: drop-shadow(0 0 8px ${props => props.theme.colors.primaryGlow});
`;

const LogoText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, #ffffff 0%, ${props => props.theme.colors.primary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const RoleBadge = styled.span`
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${props => props.theme.colors.borderColor};

  &.admin {
    color: ${props => props.theme.colors.primary};
    border-color: rgba(0, 229, 255, 0.3);
    background: rgba(0, 229, 255, 0.05);
    box-shadow: inset 0 0 10px rgba(0, 229, 255, 0.05);
  }

  &.worker {
    color: ${props => props.theme.colors.success};
    border-color: rgba(0, 230, 118, 0.3);
    background: rgba(0, 230, 118, 0.05);
    box-shadow: inset 0 0 10px rgba(0, 230, 118, 0.05);
  }
`;

const ToggleButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.colors.info} 0%, ${props => props.theme.colors.primary} 100%);
  color: #0b0f19;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: ${props => props.theme.transitions.smooth};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${props => props.theme.colors.primaryGlow};
  }
`;

const Main = styled.main`
  flex: 1;
`;

const Layout: React.FC = () => {
  const { userRole, currentUser, switchRole } = useApp();
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
        </HeaderControls>
      </MainHeader>

      <Main>
        <Outlet />
      </Main>
    </AppContainer>
  );
};

export default Layout;
