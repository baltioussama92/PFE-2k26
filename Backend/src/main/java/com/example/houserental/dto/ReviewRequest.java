package com.example.houserental.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

@Value
public class ReviewRequest {
    @NotNull
    String propertyId;

    @NotNull
    @Min(1)
    @Max(5)
    Integer rating;

    @Size(max = 1000)
    String comment;
}
