package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class MessageResponse {
    String id;
    String senderId;
    String receiverId;
    String content;
    Instant createdAt;
}

