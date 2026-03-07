package com.example.houserental.dto;

import com.example.houserental.entity.BookingStatus;
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
