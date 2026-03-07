package com.example.houserental.controller;

import com.example.houserental.dto.BookingRequest;
import com.example.houserental.dto.BookingResponse;
import com.example.houserental.dto.BookingStatusUpdateRequest;
import com.example.houserental.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
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
