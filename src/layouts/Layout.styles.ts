import styled from 'styled-components';
import { Factory } from 'lucide-react';
import { ThemeType } from '@/styles/theme';

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export const MainHeader = styled.header<{ theme: ThemeType }>`
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

export const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const LogoIcon = styled(Factory)<{ theme: ThemeType }>`
  color: ${props => props.theme.colors.primary};
  filter: drop-shadow(0 0 8px ${props => props.theme.colors.primaryGlow});
`;

export const LogoText = styled.span<{ theme: ThemeType }>`
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, #ffffff 0%, ${props => props.theme.colors.primary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const UserInfo = styled.div<{ theme: ThemeType }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const RoleBadge = styled.span<{ theme: ThemeType }>`
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

export const ToggleButton = styled.button<{ theme: ThemeType }>`
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

export const Main = styled.main`
  flex: 1;
`;

export const LogoutButton = styled.button<{ theme: ThemeType }>`
  background: rgba(255, 23, 68, 0.05);
  color: ${props => props.theme.colors.danger};
  border: 1px solid rgba(255, 23, 68, 0.2);
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
    background: ${props => props.theme.colors.danger};
    color: #ffffff;
    border-color: ${props => props.theme.colors.danger};
    box-shadow: 0 4px 15px rgba(255, 23, 68, 0.25);
  }
`;
