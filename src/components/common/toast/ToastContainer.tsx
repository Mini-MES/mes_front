import React from 'react';
import { useNotification } from '@/context/NotificationContext';
import { ToastItem } from './ToastItem';
import * as S from './ToastContainer.styles';

export const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  // 상단에 최대 5개의 최신 알림을 토스트로 띄움
  const activeToasts = notifications.slice(0, 5);

  return (
    <S.ContainerWrapper>
      {activeToasts.map((item) => (
        <ToastItem
          key={item.id}
          item={item}
          onClose={removeNotification}
        />
      ))}
    </S.ContainerWrapper>
  );
};

export default ToastContainer;
