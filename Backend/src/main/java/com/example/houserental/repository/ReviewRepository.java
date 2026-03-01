package com.example.houserental.repository;

import com.example.houserental.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
	List<Review> findByPropertyId(Long propertyId);
}
