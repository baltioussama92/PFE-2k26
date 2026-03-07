package com.example.houserental.service.impl;

import com.example.houserental.dto.PropertyRequest;
import com.example.houserental.dto.PropertyResponse;
import com.example.houserental.entity.Property;
import com.example.houserental.entity.Role;
import com.example.houserental.entity.User;
import com.example.houserental.exception.NotFoundException;
import com.example.houserental.repository.PropertyRepository;
import com.example.houserental.repository.UserRepository;
import com.example.houserental.service.PropertyService;
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
                .location(request.getLocation())
                .price(request.getPrice())
                .owner(owner)
                .build();
        Property saved = propertyRepository.save(property);
        return toResponse(saved);
    }

    @Override
    public PropertyResponse update(String id, PropertyRequest request, String email) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Property not found"));
        User current = getUserByEmail(email);
        requireOwnerOrAdmin(property, current);

        property.setTitle(request.getTitle());
        property.setLocation(request.getLocation());
        property.setPrice(request.getPrice());
        Property updated = propertyRepository.save(property);
        return toResponse(updated);
    }

    @Override
    public void delete(String id, String email) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Property not found"));
        User current = getUserByEmail(email);
        requireOwnerOrAdmin(property, current);
        propertyRepository.delete(property);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyResponse> findAll() {
        return propertyRepository.findAll().stream().map(this::toResponse).toList();
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
            Criteria priceCriteria = Criteria.where("price");
            if (minPrice != null) {
                priceCriteria = priceCriteria.gte(minPrice);
            }
            if (maxPrice != null) {
                priceCriteria = priceCriteria.lte(maxPrice);
            }
            criteriaList.add(priceCriteria);
        }

        if (available != null && available) {
            criteriaList.add(new Criteria().orOperator(
                    Criteria.where("bookings").exists(false),
                    Criteria.where("bookings").size(0)
            ));
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

    private PropertyResponse toResponse(Property property) {
        return PropertyResponse.builder()
                .id(property.getId())
                .title(property.getTitle())
                .location(property.getLocation())
                .price(property.getPrice())
                .ownerId(property.getOwner() != null ? property.getOwner().getId() : null)
                .build();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private void requireOwnerOrAdmin(Property property, User user) {
        boolean isOwner = property.getOwner() != null && property.getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException("Not authorized to modify this property");
        }
    }
}
