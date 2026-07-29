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
  const [remainingTime, setRemainingTime] = useState(duration);
  const [isPaused, setIsPaused] = useState(false);

  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(item.id);
    }, 350);
  }, [item.id, onClose]);

  // 자동 소멸 타이머 관리
  useEffect(() => {
    if (isPaused || isExiting) return;

    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      handleDismiss();
    }, remainingTime);

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newRemaining = Math.max(0, remainingTime - elapsed);

      if (newRemaining > 0) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPaused, isExiting, remainingTime, handleDismiss]);

  const handleMouseEnter = () => {
    if (isExiting) return;
    setIsPaused(true);
    const elapsed = Date.now() - startTimeRef.current;
    setRemainingTime((prev) => Math.max(0, prev - elapsed));
  };

  const handleMouseLeave = () => {
    if (isExiting) return;
    setIsPaused(false);
  };

  const progressPercentage = (remainingTime / duration) * 100;

  return (
    <S.ToastCard
      $type={item.type}
      $isExiting={isExiting}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
      <S.ProgressBar $type={item.type} $progress={progressPercentage} />
    </S.ToastCard>
  );
};
