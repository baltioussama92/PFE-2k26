package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.time.LocalDate;

@Value
@Builder
public class UnavailableDateRangeResponse {
    LocalDate checkInDate;
    LocalDate checkOutDate;
}
