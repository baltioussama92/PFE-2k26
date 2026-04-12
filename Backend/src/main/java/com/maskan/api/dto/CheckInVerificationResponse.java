package com.maskan.api.dto;

import com.maskan.api.entity.BookingStatus;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class CheckInVerificationResponse {
    String bookingId;
    BookingStatus status;
    String message;
}
