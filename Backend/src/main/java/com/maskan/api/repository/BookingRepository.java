package com.maskan.api.repository;

import com.maskan.api.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
	List<Booking> findByGuestId(String guestId);
	List<Booking> findByListingIdIn(List<String> listingIds);
}

