package com.maskan.api.service.impl;

import com.maskan.api.dto.AdminDashboardSummaryResponse;
import com.maskan.api.dto.HostDashboardSummaryResponse;
import com.maskan.api.dto.TenantDashboardSummaryResponse;
import com.maskan.api.entity.Booking;
import com.maskan.api.entity.BookingStatus;
import com.maskan.api.entity.Property;
import com.maskan.api.entity.Role;
import com.maskan.api.entity.User;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.BookingRepository;
import com.maskan.api.repository.MessageRepository;
import com.maskan.api.repository.PropertyRepository;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final BookingRepository bookingRepository;
    private final MessageRepository messageRepository;

    @Override
    public TenantDashboardSummaryResponse getTenantSummary(String email) {
        User user = getUserByEmail(email);

        List<Booking> mine = bookingRepository.findByGuestId(user.getId());
        BigDecimal spent = mine.stream()
                .filter(booking -> booking.getStatus() == BookingStatus.CONFIRMED || booking.getStatus() == BookingStatus.COMPLETED)
                .map(this::bookingAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long upcoming = mine.stream()
                .filter(booking -> booking.getStatus() == BookingStatus.CONFIRMED)
                .count();

        return TenantDashboardSummaryResponse.builder()
                .upcomingBookings(upcoming)
                .savedHomes(user.getWishlistListingIds() == null ? 0 : user.getWishlistListingIds().size())
                .inboxMessages(messageRepository.countByReceiverId(user.getId()))
                .totalSpent(spent)
                .build();
    }

    @Override
    public HostDashboardSummaryResponse getHostSummary(String email) {
        User user = getUserByEmail(email);

        List<Property> mine = propertyRepository.findByHostId(user.getId());
        List<String> ids = mine.stream().map(Property::getId).toList();
        List<Booking> bookings = ids.isEmpty() ? List.of() : bookingRepository.findByListingIdIn(ids);

        BigDecimal revenue = bookings.stream()
                .filter(booking -> booking.getStatus() == BookingStatus.CONFIRMED || booking.getStatus() == BookingStatus.COMPLETED)
                .map(this::bookingAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return HostDashboardSummaryResponse.builder()
                .totalProperties(mine.size())
                .pendingBookings(bookings.stream().filter(booking -> booking.getStatus() == BookingStatus.PENDING).count())
                .confirmedBookings(bookings.stream().filter(booking -> booking.getStatus() == BookingStatus.CONFIRMED).count())
                .inboxMessages(messageRepository.countByReceiverId(user.getId()))
                .totalRevenue(revenue)
                .build();
    }

    @Override
    public AdminDashboardSummaryResponse getAdminSummary(String email) {
        User admin = getUserByEmail(email);
        if (admin.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Not authorized to view admin summary");
        }

        return AdminDashboardSummaryResponse.builder()
                .totalUsers(userRepository.count())
                .totalHosts(userRepository.countByRole(Role.HOST))
                .totalGuests(userRepository.countByRole(Role.GUEST))
                .totalProperties(propertyRepository.count())
                .totalBookings(bookingRepository.count())
                .pendingBookings(bookingRepository.countByStatus(BookingStatus.PENDING))
                .bannedUsers(userRepository.countByBanned(Boolean.TRUE))
                .build();
    }

    private BigDecimal bookingAmount(Booking booking) {
        Property property = propertyRepository.findById(booking.getListingId()).orElse(null);
        if (property == null || property.getPricePerNight() == null) {
            return BigDecimal.ZERO;
        }

        long days = Math.max(1, ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate()));
        int guests = booking.getGuests() == null || booking.getGuests() < 1 ? 1 : booking.getGuests();
        return property.getPricePerNight().multiply(BigDecimal.valueOf(days)).multiply(BigDecimal.valueOf(guests));
    }

    public Map<String, Long> aggregateGrowthByMonthForUsers() {
        return userRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        user -> user.getCreatedAt() == null ? "unknown" : user.getCreatedAt().toString().substring(0, 7),
                        Collectors.counting()
                ));
    }

    public Map<String, Long> aggregateGrowthByMonthForProperties() {
        return propertyRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        property -> property.getCreatedAt() == null ? "unknown" : property.getCreatedAt().toString().substring(0, 7),
                        Collectors.counting()
                ));
    }

    public Map<String, Long> aggregateGrowthByMonthForBookings() {
        return bookingRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                        booking -> booking.getCreatedAt() == null ? "unknown" : booking.getCreatedAt().toString().substring(0, 7),
                        Collectors.counting()
                ));
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}
