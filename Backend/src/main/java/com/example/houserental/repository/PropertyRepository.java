package com.example.houserental.repository;

import com.example.houserental.entity.Property;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PropertyRepository extends MongoRepository<Property, String> {
}
