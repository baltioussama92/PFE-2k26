package com.maskan.api.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

import java.time.LocalDate;

@Value
public class BookingRequest {
    @NotNull
    String listingId;

    @NotNull
    @FutureOrPresent
    LocalDate checkInDate;

    @NotNull
    @FutureOrPresent
    LocalDate checkOutDate;

    public String getPropertyId() {
        return listingId;
    }

    public LocalDate getStartDate() {
        return checkInDate;
    }

    public LocalDate getEndDate() {
        return checkOutDate;
    }
}

