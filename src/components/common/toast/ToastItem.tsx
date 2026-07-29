import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';
import { NotificationItem, NotificationType } from '@/types/notification';
import * as S from './ToastItem.styles';

interface ToastItemProps {
  item: NotificationItem;
  duration?: number; // 기본 5000ms
  onClose: (id: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'HOLD':
      return <AlertOctagon size={20} />;
    case 'WARN':
      return <AlertTriangle size={20} />;
    case 'SUCCESS':
      return <CheckCircle2 size={20} />;
    case 'INFO':
    default:
      return <Info size={20} />;
  }
};

export const ToastItem: React.FC<ToastItemProps> = ({
  item,
  duration = 5000,
  onClose,
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(duration);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(item.id);
    }, 350);
  }, [item.id, onClose]);

  useEffect(() => {
    if (isExiting) return;

    if (isPaused) {
      if (timerRef.current) clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    } else {
      startTimeRef.current = Date.now();
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, remainingTimeRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPaused, isExiting, handleDismiss]);

  return (
    <S.ToastCard
      $type={item.type}
      $isExiting={isExiting}
      onMouseEnter={() => !isExiting && setIsPaused(true)}
      onMouseLeave={() => !isExiting && setIsPaused(false)}
    >
      <S.IconWrapper $type={item.type}>
        {getNotificationIcon(item.type)}
      </S.IconWrapper>
      <S.ToastContent>
        <S.ToastTitle $type={item.type}>{item.title}</S.ToastTitle>
        <S.ToastMessage>{item.message}</S.ToastMessage>
      </S.ToastContent>
      <S.CloseButton
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        aria-label="닫기"
      >
        <X size={16} />
      </S.CloseButton>
      <S.ProgressBar
        $type={item.type}
        $duration={duration}
        $isPaused={isPaused}
      />
    </S.ToastCard>
  );
};
