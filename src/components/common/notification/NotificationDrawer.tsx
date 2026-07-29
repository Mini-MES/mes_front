import React from 'react';
import {
  Bell,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  CheckCheck,
  Trash2,
  Inbox,
} from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { NotificationType } from '@/types/notification';
import * as S from './NotificationDrawer.styles';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'HOLD':
      return <AlertOctagon size={16} />;
    case 'WARN':
      return <AlertTriangle size={16} />;
    case 'SUCCESS':
      return <CheckCircle2 size={16} />;
    case 'INFO':
    default:
      return <Info size={16} />;
  }
};

const formatTime = (date: Date | string) => {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotification();

  if (!isOpen) return null;

  return (
    <>
      <S.Backdrop onClick={onClose} />
      <S.DrawerContainer role="dialog" aria-label="알림 센터">
        <S.DrawerHeader>
          <S.HeaderTitleSection>
            <S.HeaderTitle>
              <Bell size={20} style={{ color: '#00e5ff' }} />
              알림 센터
            </S.HeaderTitle>
            {unreadCount > 0 && <S.UnreadBadge>{unreadCount}</S.UnreadBadge>}
          </S.HeaderTitleSection>

          <S.HeaderActions>
            {notifications.length > 0 && (
              <>
                <S.ActionTextButton onClick={markAllAsRead} title="모두 읽음">
                  <CheckCheck size={14} />
                  읽음
                </S.ActionTextButton>
                <S.ActionTextButton onClick={clearAll} title="전체 삭제">
                  <Trash2 size={14} />
                  비우기
                </S.ActionTextButton>
              </>
            )}
            <S.ActionIconButton onClick={onClose} aria-label="닫기">
              <X size={18} />
            </S.ActionIconButton>
          </S.HeaderActions>
        </S.DrawerHeader>

        <S.DrawerContent>
          {notifications.length === 0 ? (
            <S.EmptyState>
              <Inbox size={48} style={{ opacity: 0.4 }} />
              <p>수신된 실시간 알림이 없습니다.</p>
            </S.EmptyState>
          ) : (
            notifications.map((item) => (
              <S.DrawerItemCard
                key={item.id}
                $type={item.type}
                $isRead={item.isRead}
                onClick={() => {
                  if (!item.isRead) markAsRead(item.id);
                }}
              >
                <S.ItemIconWrapper $type={item.type}>
                  {getNotificationIcon(item.type)}
                </S.ItemIconWrapper>
                <S.ItemBody>
                  <S.ItemHeaderRow>
                    <S.ItemTitle $type={item.type} $isRead={item.isRead}>
                      {item.title}
                    </S.ItemTitle>
                    <S.TimeText>{formatTime(item.timestamp)}</S.TimeText>
                  </S.ItemHeaderRow>
                  <S.ItemMessage $isRead={item.isRead}>{item.message}</S.ItemMessage>
                </S.ItemBody>
                <S.DeleteItemButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNotification(item.id);
                  }}
                  title="삭제"
                >
                  <Trash2 size={14} />
                </S.DeleteItemButton>
              </S.DrawerItemCard>
            ))
          )}
        </S.DrawerContent>
      </S.DrawerContainer>
    </>
  );
};

export default NotificationDrawer;
