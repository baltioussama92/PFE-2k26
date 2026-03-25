package com.maskan.api.dto;

import com.maskan.api.entity.BookingStatus;
import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Value
@Builder
public class BookingResponse {
    String id;
    LocalDate checkInDate;
    LocalDate checkOutDate;
    BookingStatus status;
    String listingId;
    String guestId;
    Integer guests;
    BigDecimal totalPrice;
    Instant createdAt;
    String listingTitle;
    String listingLocation;
    String listingImage;
}

