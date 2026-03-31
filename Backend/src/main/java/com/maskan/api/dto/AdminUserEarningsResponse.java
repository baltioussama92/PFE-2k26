package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Value
@Builder
public class AdminUserEarningsResponse {
    BigDecimal totalEarnings;
    String currency;
    long paidBookingsCount;
    long pendingPayoutCount;
    Instant lastPayoutAt;
    List<AdminMonthlyEarningsResponse> monthlyBreakdown;
}
