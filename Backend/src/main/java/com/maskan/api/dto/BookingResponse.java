package com.maskan.api.dto;

import com.maskan.api.entity.BookingStatus;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDate;

@Value
@Builder
public class BookingResponse {
    String id;
    LocalDate startDate;
    LocalDate endDate;
    BookingStatus status;
    String propertyId;
    String userId;
}

