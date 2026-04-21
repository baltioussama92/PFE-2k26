package com.maskan.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "admin_support_tickets")
public class SupportTicket {

    @Id
    private String id;

    private String requesterId;
    private String subject;

    @Builder.Default
    private String priority = "medium";

    @Builder.Default
    private String status = "open";

    private String assigneeId;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Instant updatedAt = Instant.now();

    @Builder.Default
    private List<MessageEntry> messages = List.of();

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MessageEntry {
        private String id;
        private String senderId;
        private String content;

        @Builder.Default
        private Instant createdAt = Instant.now();

        @Builder.Default
        private boolean internal = false;

        private Map<String, Object> metadata;
    }
}
