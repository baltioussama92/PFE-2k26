package com.maskan.api.repository;

import com.maskan.api.entity.Booking;
import com.maskan.api.entity.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
	List<Booking> findByGuestId(String guestId);
	List<Booking> findByListingIdIn(List<String> listingIds);
	long countByGuestId(String guestId);
	long countByListingIdIn(List<String> listingIds);
	long countByListingIdInAndStatus(List<String> listingIds, BookingStatus status);
	long countByGuestIdAndStatus(String guestId, BookingStatus status);
	long countByStatus(BookingStatus status);
	boolean existsByGuestIdAndListingIdAndStatus(String guestId, String listingId, BookingStatus status);
}

