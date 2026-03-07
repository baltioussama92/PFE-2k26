package com.maskan.api.controller;

import com.maskan.api.dto.ReviewRequest;
import com.maskan.api.dto.ReviewResponse;
import com.maskan.api.service.ReviewService;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasRole('TENANT')")
    public ResponseEntity<ReviewResponse> create(@Valid @RequestBody ReviewRequest request,
                                                 @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(reviewService.createReview(request, principal.getUsername()));
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<ReviewResponse>> listByProperty(@PathVariable String propertyId) {
        return ResponseEntity.ok(reviewService.getReviewsByProperty(propertyId));
    }
}

