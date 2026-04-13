package com.maskan.api.service.impl;

import com.maskan.api.dto.ReviewRequest;
import com.maskan.api.dto.ReviewResponse;
import com.maskan.api.entity.Role;
import com.maskan.api.entity.Property;
import com.maskan.api.entity.Review;
import com.maskan.api.entity.ReviewTargetType;
import com.maskan.api.entity.User;
import com.maskan.api.entity.BookingStatus;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.BookingRepository;
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
    private final BookingRepository bookingRepository;

    @Override
    public ReviewResponse createReview(ReviewRequest request, String email) {
        Property property = propertyRepository.findById(request.getListingId())
                .orElseThrow(() -> new NotFoundException("Property not found"));
        User user = getUserByEmail(email);

        if (reviewRepository.existsByListingIdAndGuestId(property.getId(), user.getId())) {
            throw new IllegalArgumentException("You already reviewed this listing");
        }

        boolean isAllowed;
        if (user.getRole() == Role.HOST) {
            boolean isListingOwner = property.getHostId().equals(user.getId());
            boolean hasConfirmedReservation = bookingRepository.existsByListingIdAndStatus(
                property.getId(),
                BookingStatus.CONFIRMED
            );
            isAllowed = isListingOwner && hasConfirmedReservation;
            if (!isAllowed) {
                throw new IllegalArgumentException("Host can review only after a confirmed reservation on owned listing");
            }
        } else {
            isAllowed = bookingRepository.existsByGuestIdAndListingIdAndStatus(
                user.getId(),
                property.getId(),
                BookingStatus.COMPLETED
            );
            if (!isAllowed) {
                throw new IllegalArgumentException("Only tenants with completed bookings can post reviews");
            }
        }

        ReviewTargetType targetType = request.getTargetType() == null
                ? ReviewTargetType.HOUSE
                : request.getTargetType();

        Review review = Review.builder()
            .listingId(property.getId())
            .guestId(user.getId())
                .authorId(user.getId())
                .authorRole(user.getRole())
                .rating(request.getRating())
                .comment(request.getComment())
                .targetType(targetType)
                .build();
        Review saved = reviewRepository.save(review);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsByProperty(String propertyId) {
        return reviewRepository.findByListingId(propertyId).stream()
                .map(this::toResponse)
                .toList();
    }

    private ReviewResponse toResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
            .guestId(review.getGuestId())
            .authorId(review.getAuthorId())
            .authorRole(review.getAuthorRole())
            .listingId(review.getListingId())
            .targetType(review.getTargetType())
            .createdAt(review.getCreatedAt())
                .build();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}

