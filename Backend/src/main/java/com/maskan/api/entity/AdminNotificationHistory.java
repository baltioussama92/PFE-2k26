package com.maskan.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "admin_notification_history")
public class AdminNotificationHistory {

    @Id
    private String id;

    private String type;
    private String channel;
    private String subject;
    private String body;
    private String status;

    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant scheduledAt;
    private Instant sentAt;

    private String actedBy;
    private Map<String, Object> metadata;
}
