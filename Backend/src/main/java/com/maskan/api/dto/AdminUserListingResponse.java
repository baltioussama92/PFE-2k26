package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.Instant;

@Value
@Builder
public class AdminUserListingResponse {
    String id;
    String title;
    String location;
    String status;
    Instant createdAt;
    BigDecimal pricePerNight;
    Double rating;
}
