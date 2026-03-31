package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Value
@Builder
public class AdminUserBookingResponse {
    String id;
    String listingId;
    String listingTitle;
    String guestId;
    String hostId;
    LocalDate checkInDate;
    LocalDate checkOutDate;
    String status;
    BigDecimal totalPrice;
    Instant createdAt;
}
