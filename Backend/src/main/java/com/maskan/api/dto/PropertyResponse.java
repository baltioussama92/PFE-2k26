package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Value
@Builder
public class PropertyResponse {
    String id;
    String title;
    String description;
    String location;
    BigDecimal pricePerNight;
    List<String> images;
    String hostId;
    Instant createdAt;
}

