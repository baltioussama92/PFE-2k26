package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class TenantDashboardSummaryResponse {
    long upcomingBookings;
    long savedHomes;
    long inboxMessages;
    BigDecimal totalSpent;
}
