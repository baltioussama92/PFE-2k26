package com.example.houserental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

import java.math.BigDecimal;

@Value
public class PropertyRequest {
    @NotBlank
    String title;

    @NotBlank
    String location;

    @NotNull
    BigDecimal price;
}
