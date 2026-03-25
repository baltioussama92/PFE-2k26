package com.maskan.api.service;

import com.maskan.api.dto.AdminDashboardSummaryResponse;
import com.maskan.api.dto.HostDashboardSummaryResponse;
import com.maskan.api.dto.TenantDashboardSummaryResponse;

public interface DashboardService {
    TenantDashboardSummaryResponse getTenantSummary(String email);
    HostDashboardSummaryResponse getHostSummary(String email);
    AdminDashboardSummaryResponse getAdminSummary(String email);
}
