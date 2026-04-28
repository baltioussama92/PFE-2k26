package com.maskan.api.service;

import com.maskan.api.entity.Notification;
import com.maskan.api.entity.NotificationType;

import java.util.List;

public interface NotificationService {
    Notification createNotification(String recipientId, String title, String message, NotificationType type);
    List<Notification> getMyNotifications(String email);
    Notification markAsRead(String notificationId, String email);
    int markAllAsRead(String email);
}
