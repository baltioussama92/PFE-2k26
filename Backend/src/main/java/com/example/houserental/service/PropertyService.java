package com.example.houserental.service;

import com.example.houserental.dto.PropertyRequest;
import com.example.houserental.dto.PropertyResponse;

import java.util.List;

public interface PropertyService {
    PropertyResponse create(PropertyRequest request, String email);
    PropertyResponse update(Long id, PropertyRequest request, String email);
    void delete(Long id, String email);
    List<PropertyResponse> findAll();
    PropertyResponse findById(Long id);
}
