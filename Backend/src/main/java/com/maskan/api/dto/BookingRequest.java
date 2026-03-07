package com.maskan.api.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

import java.time.LocalDate;

@Value
public class BookingRequest {
    @NotNull
    String propertyId;

    @NotNull
    @FutureOrPresent
    LocalDate startDate;

    @NotNull
    @FutureOrPresent
    LocalDate endDate;
}

