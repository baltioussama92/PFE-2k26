package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class ReviewResponse {
    String id;
    String propertyId;
    String userId;
    String reservationId;
    String authorName;
    int rating;
    String description;
    Instant createdAt;
}

