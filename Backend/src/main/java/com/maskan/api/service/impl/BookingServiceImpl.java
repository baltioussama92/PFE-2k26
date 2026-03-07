package com.maskan.api.service.impl;

import com.maskan.api.dto.BookingRequest;
import com.maskan.api.dto.BookingResponse;
import com.maskan.api.dto.BookingStatusUpdateRequest;
import com.maskan.api.entity.Booking;
import com.maskan.api.entity.BookingStatus;
import com.maskan.api.entity.Property;
import com.maskan.api.entity.Role;
import com.maskan.api.entity.User;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.BookingRepository;
import com.maskan.api.repository.PropertyRepository;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    @Override
    public BookingResponse createBooking(BookingRequest request, String email) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }

        Property property = propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new NotFoundException("Property not found"));
        User user = getUserByEmail(email);

        Booking booking = Booking.builder()
                .property(property)
                .user(user)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(BookingStatus.PENDING)
                .build();

        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    @Override
    public BookingResponse updateStatus(String bookingId, BookingStatusUpdateRequest request, String email) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found"));
        User current = getUserByEmail(email);

        boolean isProprietor = current.getRole() == Role.PROPRIETOR;
        boolean isOwner = booking.getProperty() != null && booking.getProperty().getOwner() != null
                && booking.getProperty().getOwner().getId().equals(current.getId());
        if (!isProprietor && !isOwner) {
            throw new IllegalArgumentException("Not authorized to update this booking");
        }

        booking.setStatus(request.getStatus());
        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(String email) {
        User user = getUserByEmail(email);
        return bookingRepository.findByUserId(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .startDate(booking.getStartDate())
                .endDate(booking.getEndDate())
                .status(booking.getStatus())
                .propertyId(booking.getProperty() != null ? booking.getProperty().getId() : null)
                .userId(booking.getUser() != null ? booking.getUser().getId() : null)
                .build();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}

