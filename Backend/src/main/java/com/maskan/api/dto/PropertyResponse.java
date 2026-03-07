package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class PropertyResponse {
    String id;
    String title;
    String location;
    BigDecimal price;
    String ownerId;
}

