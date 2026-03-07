package com.maskan.api.controller;

import com.maskan.api.dto.PropertyRequest;
import com.maskan.api.dto.PropertyResponse;
import com.maskan.api.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping
    public ResponseEntity<List<PropertyResponse>> getProperties() {
        List<PropertyResponse> listings = propertyService.findAll();
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertyResponse>> searchProperties(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean available) {
        List<PropertyResponse> listings = propertyService.search(location, minPrice, maxPrice, available);
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/{propertyId}")
    public ResponseEntity<PropertyResponse> getPropertyById(@PathVariable String propertyId) {
        PropertyResponse property = propertyService.findById(propertyId);
        return ResponseEntity.ok(property);
    }

    @PostMapping
    @PreAuthorize("hasRole('PROPRIETOR')")
    public ResponseEntity<PropertyResponse> createProperty(
            @Valid @RequestBody PropertyRequest request,
            @AuthenticationPrincipal UserDetails authenticatedUser) {
        PropertyResponse createdProperty = propertyService.create(request, authenticatedUser.getUsername());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{propertyId}")
                .buildAndExpand(createdProperty.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdProperty);
    }

    @PutMapping("/{propertyId}")
    @PreAuthorize("hasRole('PROPRIETOR')")
    public ResponseEntity<PropertyResponse> updateProperty(
            @PathVariable String propertyId,
            @Valid @RequestBody PropertyRequest request,
            @AuthenticationPrincipal UserDetails authenticatedUser) {
        PropertyResponse updatedProperty = propertyService.update(propertyId, request, authenticatedUser.getUsername());
        return ResponseEntity.ok(updatedProperty);
    }

    @DeleteMapping("/{propertyId}")
    @PreAuthorize("hasRole('PROPRIETOR')")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable String propertyId,
            @AuthenticationPrincipal UserDetails authenticatedUser) {
        propertyService.delete(propertyId, authenticatedUser.getUsername());
        return ResponseEntity.noContent().build();
    }
}

