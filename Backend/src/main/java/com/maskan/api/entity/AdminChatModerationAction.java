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
@Document(collection = "admin_chat_moderation_actions")
public class AdminChatModerationAction {

    @Id
    private String id;

    private String conversationId;
    private String action;
    private String status;
    private String severity;
    private String reason;
    private String actedBy;

    @Builder.Default
    private Instant actedAt = Instant.now();

    @Builder.Default
    private List<String> participants = List.of();

    @Builder.Default
    private List<String> flaggedMessageIds = List.of();

    private Map<String, Object> metadata;
}
