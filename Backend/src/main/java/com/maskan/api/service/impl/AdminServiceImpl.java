package com.maskan.api.service.impl;

import com.maskan.api.dto.BookingResponse;
import com.maskan.api.dto.UserDto;
import com.maskan.api.entity.Booking;
import com.maskan.api.entity.User;
import com.maskan.api.repository.BookingRepository;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

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

    private BookingResponse toBookingResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .status(booking.getStatus())
                .listingId(booking.getListingId())
                .guestId(booking.getGuestId())
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

