package com.maskan.api.dto;

import com.maskan.api.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

@Value
public class BookingStatusUpdateRequest {
    @NotNull
    BookingStatus status;
}

