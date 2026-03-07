package com.maskan.api.service.impl;

import com.maskan.api.dto.ReviewRequest;
import com.maskan.api.dto.ReviewResponse;
import com.maskan.api.entity.Property;
import com.maskan.api.entity.Review;
import com.maskan.api.entity.User;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.PropertyRepository;
import com.maskan.api.repository.ReviewRepository;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.ReviewService;
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

