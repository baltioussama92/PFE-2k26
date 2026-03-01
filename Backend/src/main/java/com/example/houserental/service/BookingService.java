package com.example.houserental.service;

import com.example.houserental.dto.BookingRequest;
import com.example.houserental.dto.BookingResponse;
import com.example.houserental.dto.BookingStatusUpdateRequest;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest request, String email);
    BookingResponse updateStatus(Long bookingId, BookingStatusUpdateRequest request, String email);
    List<BookingResponse> getMyBookings(String email);
}
