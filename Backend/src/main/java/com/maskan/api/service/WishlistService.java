package com.maskan.api.service;

import com.maskan.api.dto.PropertyResponse;

import java.util.List;

public interface WishlistService {
    List<PropertyResponse> getWishlist(String email);
    List<PropertyResponse> addToWishlist(String listingId, String email);
    List<PropertyResponse> removeFromWishlist(String listingId, String email);
}
