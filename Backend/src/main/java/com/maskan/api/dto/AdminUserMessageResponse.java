package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.List;

@Value
@Builder
public class AdminUserMessageResponse {
    String id;
    String senderId;
    String receiverId;
    String content;
    Instant createdAt;
    String conversationId;
    boolean isDeleted;
    List<String> moderationFlags;
}
