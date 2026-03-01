package com.example.houserental.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

import java.time.LocalDate;

@Value
public class BookingRequest {
    @NotNull
    Long propertyId;

    @NotNull
    @FutureOrPresent
    LocalDate startDate;

    @NotNull
    @FutureOrPresent
    LocalDate endDate;
}
