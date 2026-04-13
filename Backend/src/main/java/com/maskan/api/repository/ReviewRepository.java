package com.maskan.api.repository;

import com.maskan.api.entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
	List<Review> findByListingId(String listingId);
	boolean existsByListingIdAndGuestId(String listingId, String guestId);
}

