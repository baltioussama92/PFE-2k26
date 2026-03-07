package com.example.houserental.repository;

import com.example.houserental.entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
	List<Review> findByPropertyId(String propertyId);
}
