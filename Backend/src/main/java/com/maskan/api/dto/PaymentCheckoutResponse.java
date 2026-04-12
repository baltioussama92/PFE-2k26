package com.maskan.api.dto;

import com.maskan.api.entity.BookingStatus;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class PaymentCheckoutResponse {
    String bookingId;
    BookingStatus status;
    String stripePaymentIntentId;
    String checkInSecretCode;
    String message;
}
