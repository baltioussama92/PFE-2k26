package com.maskan.api.controller;

import com.maskan.api.dto.BookingRequest;
import com.maskan.api.dto.BookingResponse;
import com.maskan.api.dto.BookingStatusUpdateRequest;
import com.maskan.api.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<BookingResponse> create(@Valid @RequestBody BookingRequest request,
                                                  @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(bookingService.createBooking(request, principal.getUsername()));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('PROPRIETOR')")
    public ResponseEntity<BookingResponse> updateStatus(@PathVariable String id,
                                                        @Valid @RequestBody BookingStatusUpdateRequest request,
                                                        @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(bookingService.updateStatus(id, request, principal.getUsername()));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<List<BookingResponse>> myBookings(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(bookingService.getMyBookings(principal.getUsername()));
    }
}

