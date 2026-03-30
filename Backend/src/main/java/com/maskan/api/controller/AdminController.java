package com.maskan.api.controller;

import com.maskan.api.dto.BookingResponse;
import com.maskan.api.dto.AdminGrowthMetricsResponse;
import com.maskan.api.dto.PropertyResponse;
import com.maskan.api.dto.UserDto;
import com.maskan.api.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> users() {
        return ResponseEntity.ok(adminService.listUsers());
    }

    @PutMapping("/users/{id}/ban")
    public ResponseEntity<UserDto> banUser(@PathVariable String id) {
        return ResponseEntity.ok(adminService.banUser(id));
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingResponse>> bookings() {
        return ResponseEntity.ok(adminService.listBookings());
    }

    @GetMapping("/pending-listings")
    public ResponseEntity<List<PropertyResponse>> pendingListings() {
        return ResponseEntity.ok(adminService.listPendingListings());
    }

    @GetMapping("/growth-metrics")
    public ResponseEntity<AdminGrowthMetricsResponse> growthMetrics() {
        return ResponseEntity.ok(adminService.growthMetrics());
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminGrowthMetricsResponse> stats() {
        return ResponseEntity.ok(adminService.growthMetrics());
    }
}

