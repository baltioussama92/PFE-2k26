package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AdminDashboardSummaryResponse {
    long totalUsers;
    long totalHosts;
    long totalGuests;
    long totalProperties;
    long totalBookings;
    long pendingBookings;
    long bannedUsers;
}
