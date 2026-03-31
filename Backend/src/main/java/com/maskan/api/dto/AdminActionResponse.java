package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class AdminActionResponse {
    boolean success;
    String securityEventId;
    Instant deletedAt;
}
