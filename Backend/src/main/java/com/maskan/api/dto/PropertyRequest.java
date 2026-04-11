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

    Double latitude;
    Double longitude;

    @NotNull
    BigDecimal pricePerNight;

    List<String> images;

    Boolean available;
    String type;
    Integer bedrooms;
    Integer bathrooms;
    Integer area;
    List<String> amenities;

    public BigDecimal getPrice() {
        return pricePerNight;
    }
}

