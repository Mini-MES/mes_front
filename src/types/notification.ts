export type NotificationType = 'HOLD' | 'WARN' | 'SUCCESS' | 'INFO';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export type CreateNotificationInput = Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'> & {
  timestamp?: Date;
};

export interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (noti: CreateNotificationInput) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}
