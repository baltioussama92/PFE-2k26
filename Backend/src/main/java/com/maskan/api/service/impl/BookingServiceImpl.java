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

import java.math.BigDecimal;
import java.util.List;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    @Override
    public BookingResponse createBooking(BookingRequest request, String email) {
    if (request.getCheckOutDate().isBefore(request.getCheckInDate())) {
            throw new IllegalArgumentException("End date must be after start date");
        }

    Property property = propertyRepository.findById(request.getListingId())
                .orElseThrow(() -> new NotFoundException("Property not found"));
    User user = getUserByEmail(email);

        Booking booking = Booking.builder()
        .listingId(property.getId())
        .guestId(user.getId())
        .checkInDate(request.getCheckInDate())
        .checkOutDate(request.getCheckOutDate())
        .guests(request.getGuests() == null || request.getGuests() < 1 ? 1 : request.getGuests())
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

        boolean isAdmin = current.getRole() == Role.ADMIN;
        if (!isAdmin) {
            if (current.getRole() != Role.HOST) {
                throw new IllegalArgumentException("Not authorized to update this booking");
            }

            Property property = propertyRepository.findById(booking.getListingId())
                    .orElseThrow(() -> new NotFoundException("Property not found"));

            if (!current.getId().equals(property.getHostId())) {
                throw new IllegalArgumentException("Not authorized to update this booking");
            }
        }

        booking.setStatus(request.getStatus());
        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    @Override
    public void cancelBooking(String bookingId, String email) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new NotFoundException("Booking not found"));
        User current = getUserByEmail(email);

        boolean isAdmin = current.getRole() == Role.ADMIN;
        boolean isBookingGuest = current.getId().equals(booking.getGuestId());
        if (!isAdmin && !isBookingGuest) {
            throw new IllegalArgumentException("Not authorized to cancel this booking");
        }

        bookingRepository.delete(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(String email) {
        User user = getUserByEmail(email);
        return bookingRepository.findByGuestId(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getOwnerBookings(String email) {
        User owner = getUserByEmail(email);

        if (owner.getRole() == Role.ADMIN) {
            return bookingRepository.findAll().stream()
                    .map(this::toResponse)
                    .toList();
        }

        if (owner.getRole() != Role.HOST) {
            throw new IllegalArgumentException("Not authorized to view owner bookings");
        }

        List<String> ownerPropertyIds = propertyRepository.findByHostId(owner.getId()).stream()
                .map(Property::getId)
                .collect(Collectors.toList());

        if (ownerPropertyIds.isEmpty()) {
            return List.of();
        }

        return bookingRepository.findByListingIdIn(ownerPropertyIds).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private BookingResponse toResponse(Booking booking) {
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

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}

