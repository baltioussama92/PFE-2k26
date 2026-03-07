package com.example.houserental.service.impl;

import com.example.houserental.dto.ReviewRequest;
import com.example.houserental.dto.ReviewResponse;
import com.example.houserental.entity.Property;
import com.example.houserental.entity.Review;
import com.example.houserental.entity.User;
import com.example.houserental.exception.NotFoundException;
import com.example.houserental.repository.PropertyRepository;
import com.example.houserental.repository.ReviewRepository;
import com.example.houserental.repository.UserRepository;
import com.example.houserental.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    @Override
    public ReviewResponse createReview(ReviewRequest request, String email) {
        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new NotFoundException("Property not found"));
        User user = getUserByEmail(email);

        Review review = Review.builder()
                .property(property)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        Review saved = reviewRepository.save(review);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProperty(String propertyId) {
        return reviewRepository.findByPropertyId(propertyId).stream()
                .map(this::toResponse)
                .toList();
    }

    private ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .propertyId(review.getProperty() != null ? review.getProperty().getId() : null)
                .build();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
