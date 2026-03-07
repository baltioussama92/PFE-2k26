package com.example.houserental.repository;

import com.example.houserental.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
	List<Booking> findByUserId(String userId);
}
