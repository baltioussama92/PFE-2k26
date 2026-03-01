package com.example.houserental.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ReviewResponse {
    Long id;
    Integer rating;
    String comment;
    Long userId;
    Long propertyId;
}
