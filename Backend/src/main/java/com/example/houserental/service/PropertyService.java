package com.example.houserental.service;

import com.example.houserental.dto.PropertyRequest;
import com.example.houserental.dto.PropertyResponse;

import java.math.BigDecimal;
import java.util.List;

public interface PropertyService {
    PropertyResponse create(PropertyRequest request, String email);
    PropertyResponse update(String id, PropertyRequest request, String email);
    void delete(String id, String email);
    List<PropertyResponse> findAll();
    PropertyResponse findById(String id);
    List<PropertyResponse> search(String location, BigDecimal minPrice, BigDecimal maxPrice, Boolean available);
}
