import styled from 'styled-components';
import { ThemeType } from '@/styles/theme';

export const FormGroup = styled.div<{ theme: ThemeType }>`
  margin-bottom: 1rem;
  
  label {
    display: block;
    font-size: 0.85rem;
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 0.35rem;
    font-weight: 500;
  }
`;

export const FormInput = styled.input<{ theme: ThemeType }>`
  width: 100%;
  padding: 0.65rem 0.85rem;
  background: rgba(11, 15, 25, 0.6);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 8px;
  color: ${props => props.theme.colors.textPrimary};
  font-family: ${props => props.theme.fonts.sans};
  font-size: 0.9rem;
  transition: ${props => props.theme.transitions.smooth};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 8px rgba(0, 229, 255, 0.25);
  }
`;

export const FormSelect = styled.select<{ theme: ThemeType }>`
  width: 100%;
  padding: 0.65rem 0.85rem;
  background: rgba(11, 15, 25, 0.6);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 8px;
  color: ${props => props.theme.colors.textPrimary};
  font-family: ${props => props.theme.fonts.sans};
  font-size: 0.9rem;
  transition: ${props => props.theme.transitions.smooth};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 8px rgba(0, 229, 255, 0.25);
  }
`;

export const BtnSubmit = styled.button<{ theme: ThemeType }>`
  width: 100%;
  padding: 0.75rem;
  background: rgba(0, 229, 255, 0.1);
  color: ${props => props.theme.colors.primary};
  border: 1px solid rgba(0, 229, 255, 0.3);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background: ${props => props.theme.colors.primary};
    color: #0b0f19;
    box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    border-color: ${props => props.theme.colors.borderColor};
    color: ${props => props.theme.colors.textMuted};
    cursor: not-allowed;
  }
`;
