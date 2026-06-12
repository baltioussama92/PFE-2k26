package com.maskan.api.service;

import com.maskan.api.dto.ReviewDto;
import com.maskan.api.dto.ReviewResponse;
import com.maskan.api.entity.Review;

import java.util.List;

public interface ReviewService {
    Review createReview(ReviewDto dto, String currentUserId);
    List<ReviewResponse> getReviewsByProperty(String propertyId);
    String getEligibleReservationId(String userId, String propertyId);
}

