package com.maskan.api.dto;

import com.maskan.api.entity.ReviewTargetType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

@Value
public class ReviewRequest {
    @NotNull
    String listingId;

    @NotNull
    @Min(1)
    @Max(5)
    Integer rating;

    @Size(max = 1000)
    String comment;

    ReviewTargetType targetType;

    public String getPropertyId() {
        return listingId;
    }
}

