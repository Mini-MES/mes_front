import styled from 'styled-components';
import { ThemeType } from '@/styles/theme';

export const WorkerControlPanelWrapper = styled.section`
  background: ${props => props.theme.colors.bgCard};
  backdrop-filter: blur(16px);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 16px;
  padding: 1.5rem;
  transition: ${props => props.theme.transitions.smooth};
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &:hover {
    border-color: ${props => props.theme.colors.borderColorGlow};
    background: ${props => props.theme.colors.bgCardHover};
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  }
`;

export const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const QuantityController = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const BtnQty = styled.button`
  flex: 1;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${props => props.theme.colors.borderColor};
  color: ${props => props.theme.colors.textPrimary};
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    border-color: ${props => props.theme.colors.primary};
  }

  &:disabled {
    color: ${props => props.theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

export const TransitionButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 229, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary};
    color: #0b0f19;
    box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
  }

  &:disabled {
    border-color: ${props => props.theme.colors.borderColor};
    color: ${props => props.theme.colors.textMuted};
    background: transparent;
    cursor: not-allowed;
  }
`;

export const BtnActionPrimary = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.success} 0%, ${props => props.theme.colors.info} 100%);
  color: #0b0f19;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 230, 118, 0.3);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    color: ${props => props.theme.colors.textMuted};
    border: 1px solid ${props => props.theme.colors.borderColor};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;
