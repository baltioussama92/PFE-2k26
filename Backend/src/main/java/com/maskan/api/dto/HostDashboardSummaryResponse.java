package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.math.BigDecimal;

@Value
@Builder
public class HostDashboardSummaryResponse {
    long totalProperties;
    long pendingBookings;
    long confirmedBookings;
    long inboxMessages;
    BigDecimal totalRevenue;
}
