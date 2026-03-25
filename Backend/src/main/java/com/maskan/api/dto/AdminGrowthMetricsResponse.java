package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.util.List;

@Value
@Builder
public class AdminGrowthMetricsResponse {
    List<String> labels;
    List<Long> properties;
    List<Long> bookings;
    List<Long> users;
}
