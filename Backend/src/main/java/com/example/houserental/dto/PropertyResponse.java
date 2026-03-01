package com.example.houserental.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class PropertyResponse {
    Long id;
    String title;
    String location;
    BigDecimal price;
    Long ownerId;
}
