package com.maskan.api.dto;

import com.maskan.api.entity.ReviewTargetType;
import com.maskan.api.entity.Role;
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
    String authorId;
    Role authorRole;
    String listingId;
    ReviewTargetType targetType;
    Instant createdAt;
}

