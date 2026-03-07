package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ReviewResponse {
    String id;
    Integer rating;
    String comment;
    String userId;
    String propertyId;
}

