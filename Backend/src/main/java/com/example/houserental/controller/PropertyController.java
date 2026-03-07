package com.example.houserental.controller;

import com.example.houserental.dto.PropertyRequest;
import com.example.houserental.dto.PropertyResponse;
import com.example.houserental.service.PropertyService;
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

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @GetMapping
    public ResponseEntity<List<PropertyResponse>> list() {
        return ResponseEntity.ok(propertyService.findAll());
    }

    @GetMapping("/search")
    public ResponseEntity<List<PropertyResponse>> search(@RequestParam(required = false) String location,
                                                         @RequestParam(required = false) BigDecimal minPrice,
                                                         @RequestParam(required = false) BigDecimal maxPrice,
                                                         @RequestParam(required = false) Boolean available) {
        return ResponseEntity.ok(propertyService.search(location, minPrice, maxPrice, available));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> get(@PathVariable String id) {
        return ResponseEntity.ok(propertyService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<PropertyResponse> create(@Valid @RequestBody PropertyRequest request,
                                                   @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(propertyService.create(request, principal.getUsername()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<PropertyResponse> update(@PathVariable String id,
                                                   @Valid @RequestBody PropertyRequest request,
                                                   @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(propertyService.update(id, request, principal.getUsername()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER','ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable String id,
                                       @AuthenticationPrincipal UserDetails principal) {
        propertyService.delete(id, principal.getUsername());
        return ResponseEntity.noContent().build();
    }
}
