package com.maskan.api.service.impl;

import com.maskan.api.entity.Notification;
import com.maskan.api.entity.NotificationType;
import com.maskan.api.entity.User;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.NotificationRepository;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public Notification createNotification(String recipientId, String title, String message, NotificationType type) {
        Notification notification = Notification.builder()
                .recipientId(recipientId)
                .title(title)
                .message(message)
                .type(type)
                .build();

        return notificationRepository.save(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Notification> getMyNotifications(String email) {
        User user = getUserByEmail(email);
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(user.getId());
    }

    @Override
    public Notification markAsRead(String notificationId, String email) {
        User user = getUserByEmail(email);
        Notification notification = notificationRepository.findByIdAndRecipientId(notificationId, user.getId())
                .orElseThrow(() -> new NotFoundException("Notification not found"));

        if (Boolean.TRUE.equals(notification.getIsRead())) {
            return notification;
        }

        notification.setIsRead(Boolean.TRUE);
        return notificationRepository.save(notification);
    }

    @Override
    public int markAllAsRead(String email) {
        User user = getUserByEmail(email);
        List<Notification> unread = notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(user.getId());
        if (unread.isEmpty()) {
            return 0;
        }

        unread.forEach(notification -> notification.setIsRead(Boolean.TRUE));
        notificationRepository.saveAll(unread);
        return unread.size();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
