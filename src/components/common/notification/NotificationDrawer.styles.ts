import styled, { keyframes, css } from 'styled-components';
import { NotificationType } from '@/types/notification';

export const getTypeColor = (type: NotificationType) => {
  switch (type) {
    case 'HOLD':
      return '#ff4b5c';
    case 'WARN':
      return '#ffb703';
    case 'SUCCESS':
      return '#00e676';
    case 'INFO':
    default:
      return '#00f2fe';
  }
};

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 1000;
  animation: ${fadeIn} 0.25s ease forwards;
`;

export const DrawerContainer = styled.aside`
  position: fixed;
  top: 0;
  right: 0;
  width: 420px;
  max-width: 90vw;
  height: 100vh;
  background: rgba(11, 15, 25, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1px solid rgba(0, 229, 255, 0.2);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.7);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  animation: ${slideInRight} 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
`;

export const DrawerHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.6);
`;

export const HeaderTitleSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const HeaderTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const UnreadBadge = styled.span`
  padding: 2px 8px;
  border-radius: 9999px;
  background: rgba(255, 75, 92, 0.2);
  border: 1px solid #ff4b5c;
  color: #ff4b5c;
  font-size: 12px;
  font-weight: 700;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionIconButton = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: #f8fafc;
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const ActionTextButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(0, 229, 255, 0.15);
    border-color: rgba(0, 229, 255, 0.4);
    color: #00e5ff;
  }
`;

export const DrawerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 3px;
  }
`;

export const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #64748b;
  text-align: center;
  padding: 40px 0;
  font-size: 14px;
`;

export const DrawerItemCard = styled.div<{ $type: NotificationType; $isRead: boolean }>`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: 10px;
  background: ${({ $isRead }) =>
    $isRead ? 'rgba(15, 23, 42, 0.4)' : 'rgba(30, 41, 59, 0.7)'};
  border: 1px solid
    ${({ $isRead, $type }) =>
      $isRead ? 'rgba(255, 255, 255, 0.05)' : `${getTypeColor($type)}66`};
  border-left: 4px solid ${({ $type }) => getTypeColor($type)};
  transition: all 0.2s ease;
  cursor: pointer;

  ${({ $isRead, $type }) =>
    !$isRead &&
    css`
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), 0 0 10px ${getTypeColor($type)}22;
    `}

  &:hover {
    background: rgba(30, 41, 59, 0.9);
    transform: translateX(-2px);
  }
`;

export const ItemIconWrapper = styled.div<{ $type: NotificationType }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: ${({ $type }) => getTypeColor($type)};
  background: ${({ $type }) => `${getTypeColor($type)}18`};
  flex-shrink: 0;
`;

export const ItemBody = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ItemHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const ItemTitle = styled.h5<{ $type: NotificationType; $isRead: boolean }>`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: ${({ $isRead, $type }) => ($isRead ? '#94a3b8' : getTypeColor($type))};
  line-height: 1.3;
`;

export const TimeText = styled.span`
  font-size: 11px;
  color: #64748b;
  font-family: 'JetBrains Mono', monospace;
  white-space: nowrap;
`;

export const ItemMessage = styled.p<{ $isRead: boolean }>`
  margin: 0;
  font-size: 12px;
  color: ${({ $isRead }) => ($isRead ? '#64748b' : '#cbd5e1')};
  line-height: 1.4;
  word-break: break-word;
`;

export const DeleteItemButton = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.15s ease;

  &:hover {
    opacity: 1;
    color: #ff4b5c;
    background: rgba(255, 75, 92, 0.1);
  }
`;
