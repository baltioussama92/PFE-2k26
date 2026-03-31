package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class AdminUserOverviewResponse {
    String userId;
    long listingsCount;
    long bookingsAsGuestCount;
    long bookingsAsHostCount;
    long paidBookingsCount;
    long pendingBookingsCount;
    BigDecimal totalEarnings;
    BigDecimal totalSpent;
}
