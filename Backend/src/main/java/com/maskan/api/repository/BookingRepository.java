package com.maskan.api.repository;

import com.maskan.api.entity.Booking;
import com.maskan.api.entity.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
	List<Booking> findByGuestId(String guestId);
	List<Booking> findByListingIdIn(List<String> listingIds);
	List<Booking> findByListingIdAndStatusInAndCheckInDateLessThanAndCheckOutDateGreaterThan(
			String listingId,
			List<BookingStatus> statuses,
			java.time.LocalDate checkOutDate,
			java.time.LocalDate checkInDate
	);
	List<Booking> findByListingIdAndStatusInAndCheckInDateLessThanAndCheckOutDateGreaterThanAndIdNot(
			String listingId,
			List<BookingStatus> statuses,
			java.time.LocalDate checkOutDate,
			java.time.LocalDate checkInDate,
			String id
	);
	long countByGuestId(String guestId);
	long countByListingIdIn(List<String> listingIds);
	long countByListingIdInAndStatus(List<String> listingIds, BookingStatus status);
	long countByGuestIdAndStatus(String guestId, BookingStatus status);
	long countByStatus(BookingStatus status);
	boolean existsByGuestIdAndListingIdAndStatus(String guestId, String listingId, BookingStatus status);
}

