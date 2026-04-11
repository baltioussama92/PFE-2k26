package com.maskan.api.repository;

import com.maskan.api.entity.Booking;
import com.maskan.api.entity.BookingStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
	List<Booking> findByGuestId(String guestId);
	List<Booking> findByListingIdIn(List<String> listingIds);
	List<Booking> findByListingIdAndStatusIn(String listingId, List<BookingStatus> statuses);
	List<Booking> findByListingIdAndStatusInAndCheckInDateLessThanAndCheckOutDateGreaterThan(
			String listingId,
			List<BookingStatus> statuses,
			LocalDate checkOutDate,
			LocalDate checkInDate
	);
	List<Booking> findByListingIdAndStatusInAndCheckInDateLessThanAndCheckOutDateGreaterThanAndIdNot(
			String listingId,
			List<BookingStatus> statuses,
			LocalDate checkOutDate,
			LocalDate checkInDate,
			String id
	);
	boolean existsByGuestIdAndStatusAndCheckOutDateAfter(String guestId, BookingStatus status, LocalDate checkOutDate);
	long countByGuestId(String guestId);
	long countByListingIdIn(List<String> listingIds);
	long countByListingIdInAndStatus(List<String> listingIds, BookingStatus status);
	long countByGuestIdAndStatus(String guestId, BookingStatus status);
	long countByStatus(BookingStatus status);
	boolean existsByGuestIdAndListingIdAndStatus(String guestId, String listingId, BookingStatus status);
}

