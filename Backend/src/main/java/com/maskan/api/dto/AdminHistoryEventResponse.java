package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;
import java.util.Map;

@Value
@Builder
public class AdminHistoryEventResponse {
    String id;
    String type;
    String description;
    Map<String, Object> metadata;
    Instant createdAt;
}
