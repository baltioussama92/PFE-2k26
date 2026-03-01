package com.example.houserental.dto;

import com.example.houserental.entity.BookingStatus;
import lombok.Builder;
import lombok.Value;

import java.time.LocalDate;

@Value
@Builder
public class BookingResponse {
    Long id;
    LocalDate startDate;
    LocalDate endDate;
    BookingStatus status;
    Long propertyId;
    Long userId;
}
