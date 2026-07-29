import React from 'react';
import styled from 'styled-components';
import { useNotification } from '@/context/NotificationContext';
import { ToastItem } from './ToastItem';

const ContainerWrapper = styled.div`
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`;

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  // 상단에 최대 5개의 최신 알림을 토스트로 띄움
  const activeToasts = notifications.slice(0, 5);

  return (
    <ContainerWrapper>
      {activeToasts.map((item) => (
        <ToastItem
          key={item.id}
          item={item}
          onClose={removeNotification}
        />
      ))}
    </ContainerWrapper>
  );
};

export default ToastContainer;
