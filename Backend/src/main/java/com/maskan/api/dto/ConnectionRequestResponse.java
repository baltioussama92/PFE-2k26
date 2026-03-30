package com.maskan.api.dto;

import com.maskan.api.entity.ConnectionStatus;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class ConnectionRequestResponse {
    String id;
    String requesterId;
    String receiverId;
    ConnectionStatus status;
    Instant createdAt;
    Instant respondedAt;
}
