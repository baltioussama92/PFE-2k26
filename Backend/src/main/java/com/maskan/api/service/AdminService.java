package com.maskan.api.service;

import com.maskan.api.dto.BookingResponse;
import com.maskan.api.dto.AdminGrowthMetricsResponse;
import com.maskan.api.dto.PropertyResponse;
import com.maskan.api.dto.UserDto;

import java.util.List;

public interface AdminService {
    List<UserDto> listUsers();
    UserDto banUser(String userId);
    List<BookingResponse> listBookings();
    List<PropertyResponse> listPendingListings();
    AdminGrowthMetricsResponse growthMetrics();
}

