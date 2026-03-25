package com.maskan.api.service.impl;

import com.maskan.api.dto.PropertyRequest;
import com.maskan.api.dto.PropertyResponse;
import com.maskan.api.entity.Property;
import com.maskan.api.entity.Role;
import com.maskan.api.entity.User;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.PropertyRepository;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;

    @Override
    public PropertyResponse create(PropertyRequest request, String email) {
        User owner = getUserByEmail(email);
        Property property = Property.builder()
                .title(request.getTitle())
            .description(request.getDescription())
                .location(request.getLocation())
            .pricePerNight(request.getPricePerNight())
            .images(request.getImages() == null ? List.of() : request.getImages())
            .available(request.getAvailable() == null ? Boolean.TRUE : request.getAvailable())
            .type(request.getType())
            .bedrooms(request.getBedrooms())
            .bathrooms(request.getBathrooms())
            .area(request.getArea())
            .amenities(request.getAmenities() == null ? List.of() : request.getAmenities())
            .pendingApproval(Boolean.TRUE)
            .hostId(owner.getId())
                .build();
        Property saved = propertyRepository.save(property);
        return toResponse(saved);
    }

    @Override
    public PropertyResponse update(String id, PropertyRequest request, String email) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Property not found"));
        User current = getUserByEmail(email);
        requireOwnerOrProprietor(property, current);

        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setLocation(request.getLocation());
        property.setPricePerNight(request.getPricePerNight());
        property.setImages(request.getImages() == null ? List.of() : request.getImages());
        if (request.getAvailable() != null) {
            property.setAvailable(request.getAvailable());
        }
        property.setType(request.getType());
        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setArea(request.getArea());
        property.setAmenities(request.getAmenities() == null ? List.of() : request.getAmenities());
        Property updated = propertyRepository.save(property);
        return toResponse(updated);
    }

    @Override
    public void delete(String id, String email) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Property not found"));
        User current = getUserByEmail(email);
        requireOwnerOrProprietor(property, current);
        propertyRepository.delete(property);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyResponse> findAll() {
        return propertyRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyResponse> findMine(String email) {
        User owner = getUserByEmail(email);
        return propertyRepository.findByHostId(owner.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyResponse findById(String id) {
        return propertyRepository.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new NotFoundException("Property not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyResponse> search(String location, BigDecimal minPrice, BigDecimal maxPrice, Boolean available) {
        List<Criteria> criteriaList = new ArrayList<>();

        if (location != null && !location.isBlank()) {
            criteriaList.add(Criteria.where("location").regex(location, "i"));
        }

        if (minPrice != null || maxPrice != null) {
            Criteria priceCriteria = Criteria.where("pricePerNight");
            if (minPrice != null) {
                priceCriteria = priceCriteria.gte(minPrice);
            }
            if (maxPrice != null) {
                priceCriteria = priceCriteria.lte(maxPrice);
            }
            criteriaList.add(priceCriteria);
        }

        if (available != null) {
            criteriaList.add(Criteria.where("available").is(available));
        }

        Query query = new Query();
        if (!criteriaList.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Property.class)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<PropertyResponse> findPendingApproval() {
        return propertyRepository.findByPendingApprovalTrue().stream()
                .map(this::toResponse)
                .toList();
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

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private void requireOwnerOrProprietor(Property property, User user) {
        boolean isOwner = property.getHostId() != null && property.getHostId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException("Not authorized to modify this property");
        }
    }
}

