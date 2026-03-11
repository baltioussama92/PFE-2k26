package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class ReviewResponse {
    String id;
    Integer rating;
    String comment;
    String guestId;
    String listingId;
    Instant createdAt;
}

