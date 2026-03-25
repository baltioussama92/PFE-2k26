package com.maskan.api.service;

import com.maskan.api.dto.PropertyRequest;
import com.maskan.api.dto.PropertyResponse;

import java.math.BigDecimal;
import java.util.List;

public interface PropertyService {
    PropertyResponse create(PropertyRequest request, String email);
    PropertyResponse update(String id, PropertyRequest request, String email);
    void delete(String id, String email);
    List<PropertyResponse> findAll();
    List<PropertyResponse> findMine(String email);
    PropertyResponse findById(String id);
    List<PropertyResponse> search(String location, BigDecimal minPrice, BigDecimal maxPrice, Boolean available);
    List<PropertyResponse> findPendingApproval();
}

