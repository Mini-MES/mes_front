import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import {
  NotificationItem,
  CreateNotificationInput,
  NotificationContextType,
} from '@/types/notification';

const MAX_NOTIFICATIONS = 100; // 최대 알림 개수 제한

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((input: CreateNotificationInput) => {
    const newItem: NotificationItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: input.type,
      title: input.title,
      message: input.message,
      timestamp: input.timestamp || new Date(),
      isRead: false,
    };

    setNotifications((prev) =>  {
      const notification = [newItem, ...prev];
      return notification.slice(0, MAX_NOTIFICATIONS);
    });
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((item) => (item.isRead ? item : { ...item, isRead: true }))
    );
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications]
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAll,
    }),
    [notifications, unreadCount, addNotification, markAsRead, markAllAsRead, removeNotification, clearAll]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const useNotificationContext = useNotification;
