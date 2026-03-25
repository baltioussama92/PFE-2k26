package com.maskan.api.service.impl;

import com.maskan.api.dto.PropertyResponse;
import com.maskan.api.entity.Property;
import com.maskan.api.entity.User;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.PropertyRepository;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PropertyResponse> getWishlist(String email) {
        User user = getUserByEmail(email);
        List<String> ids = user.getWishlistListingIds() == null ? List.of() : user.getWishlistListingIds();
        if (ids.isEmpty()) {
            return List.of();
        }

        return propertyRepository.findAllById(ids).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<PropertyResponse> addToWishlist(String listingId, String email) {
        User user = getUserByEmail(email);
        propertyRepository.findById(listingId)
                .orElseThrow(() -> new NotFoundException("Property not found"));

        List<String> ids = new ArrayList<>(user.getWishlistListingIds() == null ? List.of() : user.getWishlistListingIds());
        if (!ids.contains(listingId)) {
            ids.add(listingId);
            user.setWishlistListingIds(ids);
            userRepository.save(user);
        }

        return getWishlist(email);
    }

    @Override
    public List<PropertyResponse> removeFromWishlist(String listingId, String email) {
        User user = getUserByEmail(email);
        List<String> ids = new ArrayList<>(user.getWishlistListingIds() == null ? List.of() : user.getWishlistListingIds());
        ids.removeIf(id -> id.equals(listingId));
        user.setWishlistListingIds(ids);
        userRepository.save(user);
        return getWishlist(email);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private PropertyResponse toResponse(Property property) {
        return PropertyResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .location(property.getLocation())
                .pricePerNight(property.getPricePerNight())
                .images(property.getImages())
                .hostId(property.getHostId())
                .createdAt(property.getCreatedAt())
                .available(property.getAvailable())
                .type(property.getType())
                .bedrooms(property.getBedrooms())
                .bathrooms(property.getBathrooms())
                .area(property.getArea())
                .amenities(property.getAmenities())
                .rating(property.getRating())
                .reviewCount(property.getReviewCount())
                .pendingApproval(property.getPendingApproval())
                .build();
    }
}
