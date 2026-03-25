package com.maskan.api.service.impl;

import com.maskan.api.dto.BookingResponse;
import com.maskan.api.dto.AdminGrowthMetricsResponse;
import com.maskan.api.dto.PropertyResponse;
import com.maskan.api.dto.UserDto;
import com.maskan.api.entity.Booking;
import com.maskan.api.entity.Property;
import com.maskan.api.entity.User;
import com.maskan.api.entity.Role;
import com.maskan.api.repository.BookingRepository;
import com.maskan.api.repository.PropertyRepository;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.TreeSet;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> listUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public UserDto banUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        user.setBanned(Boolean.TRUE);
        User updated = userRepository.save(user);
        return toDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> listBookings() {
        return bookingRepository.findAll().stream()
                .map(this::toBookingResponse)
                .toList();
    }

        @Override
        @Transactional(readOnly = true)
        public List<PropertyResponse> listPendingListings() {
        return propertyRepository.findByPendingApprovalTrue().stream()
            .map(this::toPropertyResponse)
            .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public AdminGrowthMetricsResponse growthMetrics() {
        Map<String, Long> usersByMonth = userRepository.findAll().stream()
            .collect(Collectors.groupingBy(user -> user.getCreatedAt() == null ? "unknown" : user.getCreatedAt().toString().substring(0, 7), Collectors.counting()));

        Map<String, Long> propertiesByMonth = propertyRepository.findAll().stream()
            .collect(Collectors.groupingBy(property -> property.getCreatedAt() == null ? "unknown" : property.getCreatedAt().toString().substring(0, 7), Collectors.counting()));

        Map<String, Long> bookingsByMonth = bookingRepository.findAll().stream()
            .collect(Collectors.groupingBy(booking -> booking.getCreatedAt() == null ? "unknown" : booking.getCreatedAt().toString().substring(0, 7), Collectors.counting()));

        TreeSet<String> labels = new TreeSet<>();
        labels.addAll(usersByMonth.keySet());
        labels.addAll(propertiesByMonth.keySet());
        labels.addAll(bookingsByMonth.keySet());

        List<String> labelList = labels.stream().filter(label -> !"unknown".equals(label)).toList();

        return AdminGrowthMetricsResponse.builder()
            .labels(labelList)
            .users(labelList.stream().map(label -> usersByMonth.getOrDefault(label, 0L)).toList())
            .properties(labelList.stream().map(label -> propertiesByMonth.getOrDefault(label, 0L)).toList())
            .bookings(labelList.stream().map(label -> bookingsByMonth.getOrDefault(label, 0L)).toList())
            .build();
        }

    private BookingResponse toBookingResponse(Booking booking) {
        Property listing = propertyRepository.findById(booking.getListingId()).orElse(null);
        BigDecimal totalPrice = BigDecimal.ZERO;
        if (listing != null && listing.getPricePerNight() != null) {
            long days = Math.max(1, ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate()));
            int guests = booking.getGuests() == null || booking.getGuests() < 1 ? 1 : booking.getGuests();
            totalPrice = listing.getPricePerNight()
                .multiply(BigDecimal.valueOf(days))
                .multiply(BigDecimal.valueOf(guests));
        }

        return BookingResponse.builder()
                .id(booking.getId())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .status(booking.getStatus())
                .listingId(booking.getListingId())
                .guestId(booking.getGuestId())
            .guests(booking.getGuests())
            .totalPrice(totalPrice)
            .createdAt(booking.getCreatedAt())
            .listingTitle(listing != null ? listing.getTitle() : null)
            .listingLocation(listing != null ? listing.getLocation() : null)
            .listingImage(listing != null && listing.getImages() != null && !listing.getImages().isEmpty() ? listing.getImages().get(0) : null)
                .build();
    }

        private PropertyResponse toPropertyResponse(Property property) {
        return PropertyResponse.builder()
            .id(property.getId())
            .title(property.getTitle())
            .description(property.getDescription())
            .location(property.getLocation())
            .pricePerNight(property.getPricePerNight())
            .images(property.getImages())
            .hostId(property.getHostId())
            .createdAt(property.getCreatedAt())
            .available(property.getAvailable())
            .type(property.getType())
            .bedrooms(property.getBedrooms())
            .bathrooms(property.getBathrooms())
            .area(property.getArea())
            .amenities(property.getAmenities())
            .rating(property.getRating())
            .reviewCount(property.getReviewCount())
            .pendingApproval(property.getPendingApproval())
            .build();
        }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .isVerified(user.getIsVerified())
                .banned(user.getBanned())
                .build();
    }
}

