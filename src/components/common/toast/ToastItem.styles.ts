import styled, { keyframes, css } from 'styled-components';
import { NotificationType } from '@/types/notification';

export const getTypeColors = (type: NotificationType) => {
  switch (type) {
    case 'HOLD':
      return {
        main: '#ff4b5c',
        bg: 'rgba(255, 75, 92, 0.12)',
        glow: 'rgba(255, 75, 92, 0.4)',
        border: '#ff4b5c',
      };
    case 'WARN':
      return {
        main: '#ffb703',
        bg: 'rgba(255, 183, 3, 0.12)',
        glow: 'rgba(255, 183, 3, 0.4)',
        border: '#ffb703',
      };
    case 'SUCCESS':
      return {
        main: '#00e676',
        bg: 'rgba(0, 230, 118, 0.12)',
        glow: 'rgba(0, 230, 118, 0.4)',
        border: '#00e676',
      };
    case 'INFO':
    default:
      return {
        main: '#00f2fe',
        bg: 'rgba(0, 242, 254, 0.12)',
        glow: 'rgba(0, 242, 254, 0.4)',
        border: '#00f2fe',
      };
  }
};

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(120%) scale(0.9);
  }
`;

export const ToastCard = styled.div<{ $type: NotificationType; $isExiting: boolean }>`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  width: 360px;
  max-width: calc(100vw - 32px);
  padding: 16px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  
  ${({ $type }) => {
    const colors = getTypeColors($type);
    return css`
      border: 1px solid ${colors.border};
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5),
                  0 0 16px ${colors.glow},
                  inset 0 0 12px ${colors.bg};
    `;
  }}

  animation: ${({ $isExiting }) => ($isExiting ? slideOut : slideIn)} 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const IconWrapper = styled.div<{ $type: NotificationType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  color: ${({ $type }) => getTypeColors($type).main};
  background: ${({ $type }) => getTypeColors($type).bg};
  border: 1px solid ${({ $type }) => getTypeColors($type).border}44;
`;

export const ToastContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ToastTitle = styled.h4<{ $type: NotificationType }>`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: ${({ $type }) => getTypeColors($type).main};
  line-height: 1.3;
  letter-spacing: -0.01em;
`;

export const ToastMessage = styled.p`
  margin: 0;
  font-size: 13px;
  color: #cbd5e1;
  line-height: 1.45;
  word-break: break-word;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
  padding: 4px;
  margin: -4px -4px 0 0;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease, background-color 0.15s ease;

  &:hover {
    color: #f8fafc;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const ProgressBar = styled.div<{ $type: NotificationType; $progress: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: ${({ $progress }) => $progress}%;
  background-color: ${({ $type }) => getTypeColors($type).main};
  box-shadow: 0 0 8px ${({ $type }) => getTypeColors($type).glow};
  transition: width 0.1s linear;
`;
