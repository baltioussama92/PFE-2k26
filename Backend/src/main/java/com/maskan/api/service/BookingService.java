package com.maskan.api.service;

import com.maskan.api.dto.BookingRequest;
import com.maskan.api.dto.BookingResponse;
import com.maskan.api.dto.BookingStatusUpdateRequest;
import com.maskan.api.dto.UnavailableDateRangeResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest request, String email);
    BookingResponse updateStatus(String bookingId, BookingStatusUpdateRequest request, String email);
    void cancelBooking(String bookingId, String email);
    List<BookingResponse> getMyBookings(String email);
    List<BookingResponse> getOwnerBookings(String email);
    List<BookingResponse> getAllBookings();
    List<UnavailableDateRangeResponse> getUnavailableDateRangesForListing(String listingId);
}

