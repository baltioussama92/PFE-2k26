package com.maskan.api.repository;

import com.maskan.api.entity.Property;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PropertyRepository extends MongoRepository<Property, String> {
}

