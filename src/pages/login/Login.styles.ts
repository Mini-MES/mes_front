import styled, { keyframes } from 'styled-components';
import { ThemeType } from '@/styles/theme';

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(0, 229, 255, 0.2), 0 0 15px rgba(41, 121, 255, 0.1);
  }
  50% {
    box-shadow: 0 0 15px rgba(0, 229, 255, 0.4), 0 0 25px rgba(41, 121, 255, 0.2);
  }
  100% {
    box-shadow: 0 0 5px rgba(0, 229, 255, 0.2), 0 0 15px rgba(41, 121, 255, 0.1);
  }
`;

export const LoginContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-color: ${props => props.theme.colors.bgMain};
  background-image: 
    radial-gradient(at 0% 0%, rgba(0, 229, 255, 0.08) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(41, 121, 255, 0.08) 0px, transparent 50%);
`;

export const LoginCard = styled.div<{ theme: ThemeType }>`
  width: 100%;
  max-width: 440px;
  background: ${props => props.theme.colors.bgCard};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 20px;
  padding: 3rem 2.5rem;
  animation: ${glowAnimation} 6s infinite ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const LoginHeader = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
`;

export const LogoWrapper = styled.div<{ theme: ThemeType }>`
  color: ${props => props.theme.colors.primary};
  filter: drop-shadow(0 0 10px ${props => props.theme.colors.primaryGlow});
  margin-bottom: 0.5rem;
`;

export const LoginTitle = styled.h1<{ theme: ThemeType }>`
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, #ffffff 0%, ${props => props.theme.colors.primary} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const LoginSubtitle = styled.p<{ theme: ThemeType }>`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

export const InputGroup = styled.div<{ theme: ThemeType }>`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  label {
    font-size: 0.8rem;
    color: ${props => props.theme.colors.textSecondary};
    font-weight: 500;
  }
`;

export const InputField = styled.input<{ theme: ThemeType }>`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(11, 15, 25, 0.7);
  border: 1px solid ${props => props.theme.colors.borderColor};
  border-radius: 10px;
  color: ${props => props.theme.colors.textPrimary};
  font-family: ${props => props.theme.fonts.sans};
  font-size: 0.95rem;
  transition: ${props => props.theme.transitions.smooth};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 10px rgba(0, 229, 255, 0.25);
    background: rgba(11, 15, 25, 0.9);
  }
`;

export const ErrorText = styled.p<{ theme: ThemeType }>`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.danger};
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
`;

export const SubmitBtn = styled.button<{ theme: ThemeType }>`
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, ${props => props.theme.colors.info} 0%, ${props => props.theme.colors.primary} 100%);
  color: #0b0f19;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: ${props => props.theme.transitions.smooth};
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px ${props => props.theme.colors.primaryGlow};
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    color: ${props => props.theme.colors.textMuted};
    border: 1px solid ${props => props.theme.colors.borderColor};
    cursor: not-allowed;
    transform: none;
  }
`;
