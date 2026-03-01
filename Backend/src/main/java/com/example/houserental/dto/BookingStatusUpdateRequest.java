package com.example.houserental.dto;

import com.example.houserental.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

@Value
public class BookingStatusUpdateRequest {
    @NotNull
    BookingStatus status;
}
