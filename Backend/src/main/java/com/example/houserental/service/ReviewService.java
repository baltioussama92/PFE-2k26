package com.example.houserental.service;

import com.example.houserental.dto.ReviewRequest;
import com.example.houserental.dto.ReviewResponse;

import java.util.List;

public interface ReviewService {
    ReviewResponse createReview(ReviewRequest request, String email);
    List<ReviewResponse> getReviewsByProperty(Long propertyId);
}
