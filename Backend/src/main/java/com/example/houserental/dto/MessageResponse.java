package com.example.houserental.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class MessageResponse {
    Long id;
    Long senderId;
    Long receiverId;
    String content;
    Instant createdAt;
}
