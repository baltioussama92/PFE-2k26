package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class AdminMonthlyEarningsResponse {
    String month;
    BigDecimal earnings;
    long bookingsCount;
}
