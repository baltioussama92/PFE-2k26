package com.maskan.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

import java.math.BigDecimal;
import java.util.List;

@Value
public class PropertyRequest {
    @NotBlank
    String title;

    @NotBlank
    String description;

    @NotBlank
    String location;

    @NotNull
    BigDecimal pricePerNight;

    List<String> images;

    public BigDecimal getPrice() {
        return pricePerNight;
    }
}

