package com.maskan.api.service.impl;

import com.maskan.api.entity.AdminChatModerationAction;
import com.maskan.api.entity.AdminContent;
import com.maskan.api.entity.AdminNotificationHistory;
import com.maskan.api.entity.AdminNotificationTemplate;
import com.maskan.api.entity.AdminReport;
import com.maskan.api.entity.AdminSettings;
import com.maskan.api.entity.Booking;
import com.maskan.api.entity.BookingStatus;
import com.maskan.api.entity.Message;
import com.maskan.api.entity.Property;
import com.maskan.api.entity.SupportTicket;
import com.maskan.api.entity.User;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.AdminChatModerationActionRepository;
import com.maskan.api.repository.AdminContentRepository;
import com.maskan.api.repository.AdminNotificationHistoryRepository;
import com.maskan.api.repository.AdminNotificationTemplateRepository;
import com.maskan.api.repository.AdminReportRepository;
import com.maskan.api.repository.AdminSettingsRepository;
import com.maskan.api.repository.BookingRepository;
import com.maskan.api.repository.MessageRepository;
import com.maskan.api.repository.PropertyRepository;
import com.maskan.api.repository.SupportTicketRepository;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.AdminWorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminWorkspaceServiceImpl implements AdminWorkspaceService {

    private static final String SETTINGS_ID = "default";
    private static final String CONTENT_ID = "default";

    private final AdminReportRepository adminReportRepository;
    private final AdminChatModerationActionRepository adminChatModerationActionRepository;
    private final SupportTicketRepository supportTicketRepository;
    private final AdminSettingsRepository adminSettingsRepository;
    private final AdminContentRepository adminContentRepository;
    private final AdminNotificationTemplateRepository adminNotificationTemplateRepository;
    private final AdminNotificationHistoryRepository adminNotificationHistoryRepository;
    private final MessageRepository messageRepository;
    private final BookingRepository bookingRepository;
    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> listReports() {
        return adminReportRepository.findAll().stream()
                .sorted(Comparator.comparing(AdminReport::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toReportMap)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getReportById(String id) {
        AdminReport report = adminReportRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Report not found"));
        return toReportMap(report);
    }

    @Override
    public Map<String, Object> updateReportStatus(String id, String status, String internalNote, String actedBy) {
        AdminReport report = adminReportRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Report not found"));

        String normalizedStatus = normalizeRequired(status, "status").toLowerCase(Locale.ROOT);
        if (!List.of("open", "investigating", "resolved", "closed").contains(normalizedStatus)) {
            throw new IllegalArgumentException("Invalid status. Allowed values: open, investigating, resolved, closed");
        }

        report.setStatus(normalizedStatus);
        report.setActedBy(actedBy);
        report.setActedAt(Instant.now());

        if (internalNote != null && !internalNote.isBlank()) {
            List<AdminReport.InternalNote> notes = new ArrayList<>(safeList(report.getInternalNotes()));
            notes.add(AdminReport.InternalNote.builder()
                    .id(UUID.randomUUID().toString())
                    .author(actedBy)
                    .note(internalNote.trim())
                    .createdAt(Instant.now())
                    .build());
            report.setInternalNotes(notes);
        }

        return toReportMap(adminReportRepository.save(report));
    }

    @Override
    public Map<String, Object> applyReportAction(String id, String action, String note, String actedBy, Map<String, Object> metadata) {
        AdminReport report = adminReportRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Report not found"));

        String normalizedAction = normalizeRequired(action, "action").toLowerCase(Locale.ROOT);
        if (!List.of("warn", "suspend", "ban", "refund", "close_case").contains(normalizedAction)) {
            throw new IllegalArgumentException("Invalid action. Allowed values: warn, suspend, ban, refund, close_case");
        }

        if (("suspend".equals(normalizedAction) || "ban".equals(normalizedAction))
                && "user".equalsIgnoreCase(report.getTargetType())
                && report.getTargetId() != null) {
            userRepository.findById(report.getTargetId()).ifPresent(user -> {
                user.setBanned(Boolean.TRUE);
                userRepository.save(user);
            });
        }

        report.setDecision(AdminReport.Decision.builder()
                .action(normalizedAction)
                .actor(actedBy)
                .actedAt(Instant.now())
                .metadata(metadata == null ? Map.of() : metadata)
                .build());
        report.setActionReason(note);
        report.setActedBy(actedBy);
        report.setActedAt(Instant.now());
        if ("close_case".equals(normalizedAction)) {
            report.setStatus("closed");
        } else if ("refund".equals(normalizedAction)) {
            report.setStatus("resolved");
        } else if ("warn".equals(normalizedAction)) {
            report.setStatus("investigating");
        }

        if (note != null && !note.isBlank()) {
            List<AdminReport.InternalNote> notes = new ArrayList<>(safeList(report.getInternalNotes()));
            notes.add(AdminReport.InternalNote.builder()
                    .id(UUID.randomUUID().toString())
                    .author(actedBy)
                    .note(note.trim())
                    .createdAt(Instant.now())
                    .build());
            report.setInternalNotes(notes);
        }

        return toReportMap(adminReportRepository.save(report));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> listFlaggedConversations() {
        return buildFlaggedConversations().values().stream()
                .sorted((left, right) -> {
                    Instant l = (Instant) left.get("lastFlagAt");
                    Instant r = (Instant) right.get("lastFlagAt");
                    if (l == null && r == null) {
                        return 0;
                    }
                    if (l == null) {
                        return 1;
                    }
                    if (r == null) {
                        return -1;
                    }
                    return r.compareTo(l);
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getFlaggedConversation(String conversationId) {
        Map<String, Map<String, Object>> grouped = buildFlaggedConversations();
        Map<String, Object> conversation = grouped.get(conversationId);
        if (conversation == null) {
            throw new NotFoundException("Flagged conversation not found");
        }
        return conversation;
    }

    @Override
    public Map<String, Object> createModerationAction(String conversationId, String action, String reason, String severity, String actedBy) {
        String normalizedAction = normalizeRequired(action, "action").toLowerCase(Locale.ROOT);
        if (!List.of("mute", "warn", "suspend", "ban").contains(normalizedAction)) {
            throw new IllegalArgumentException("Invalid moderation action. Allowed values: mute, warn, suspend, ban");
        }

        Map<String, Object> flaggedConversation = getFlaggedConversation(conversationId);
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> flaggedMessages = (List<Map<String, Object>>) flaggedConversation.getOrDefault("flaggedMessages", List.of());
        @SuppressWarnings("unchecked")
        List<String> participants = (List<String>) flaggedConversation.getOrDefault("participants", List.of());

        List<String> flaggedMessageIds = flaggedMessages.stream()
                .map(message -> Objects.toString(message.get("messageId"), null))
                .filter(Objects::nonNull)
                .toList();

        AdminChatModerationAction record = AdminChatModerationAction.builder()
                .conversationId(conversationId)
                .action(normalizedAction)
                .status("applied")
                .severity(severity == null || severity.isBlank() ? Objects.toString(flaggedConversation.get("severity"), "medium") : severity)
                .reason(reason)
                .actedBy(actedBy)
                .actedAt(Instant.now())
                .participants(participants)
                .flaggedMessageIds(flaggedMessageIds)
                .metadata(Map.of("flaggedCount", flaggedMessageIds.size()))
                .build();

        AdminChatModerationAction saved = adminChatModerationActionRepository.save(record);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", saved.getId());
        response.put("conversationId", saved.getConversationId());
        response.put("action", saved.getAction());
        response.put("status", saved.getStatus());
        response.put("severity", saved.getSeverity());
        response.put("reason", saved.getReason());
        response.put("actedBy", saved.getActedBy());
        response.put("actedAt", saved.getActedAt());
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> listSupportTickets() {
        return supportTicketRepository.findAll().stream()
                .sorted(Comparator.comparing(SupportTicket::getUpdatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toTicketMap)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getSupportTicketById(String id) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Support ticket not found"));
        return toTicketMap(ticket);
    }

    @Override
    public Map<String, Object> patchSupportTicket(String id, String action, String assigneeId, String reason, String actedBy) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Support ticket not found"));

        String normalizedAction = normalizeRequired(action, "action").toLowerCase(Locale.ROOT);
        if (!List.of("assign", "escalate", "resolve", "close").contains(normalizedAction)) {
            throw new IllegalArgumentException("Invalid action. Allowed values: assign, escalate, resolve, close");
        }

        switch (normalizedAction) {
            case "assign" -> {
                if (assigneeId == null || assigneeId.isBlank()) {
                    throw new IllegalArgumentException("assigneeId is required for assign action");
                }
                ticket.setAssigneeId(assigneeId.trim());
                ticket.setStatus("assigned");
            }
            case "escalate" -> ticket.setStatus("escalated");
            case "resolve" -> ticket.setStatus("resolved");
            case "close" -> ticket.setStatus("closed");
            default -> {
            }
        }

        List<SupportTicket.MessageEntry> messages = new ArrayList<>(safeList(ticket.getMessages()));
        if (reason != null && !reason.isBlank()) {
            messages.add(SupportTicket.MessageEntry.builder()
                    .id(UUID.randomUUID().toString())
                    .senderId(actedBy)
                    .content("[" + normalizedAction.toUpperCase(Locale.ROOT) + "] " + reason.trim())
                    .createdAt(Instant.now())
                    .internal(true)
                    .metadata(Map.of("action", normalizedAction))
                    .build());
            ticket.setMessages(messages);
        }

        ticket.setUpdatedAt(Instant.now());
        return toTicketMap(supportTicketRepository.save(ticket));
    }

    @Override
    public Map<String, Object> addSupportTicketMessage(String id, String senderId, String content, boolean internal, String actedBy) {
        SupportTicket ticket = supportTicketRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Support ticket not found"));

        String finalSender = senderId == null || senderId.isBlank() ? actedBy : senderId.trim();
        String finalContent = normalizeRequired(content, "content");

        List<SupportTicket.MessageEntry> messages = new ArrayList<>(safeList(ticket.getMessages()));
        messages.add(SupportTicket.MessageEntry.builder()
                .id(UUID.randomUUID().toString())
                .senderId(finalSender)
                .content(finalContent)
                .createdAt(Instant.now())
                .internal(internal)
                .metadata(Map.of())
                .build());

        ticket.setMessages(messages);
        ticket.setUpdatedAt(Instant.now());
        return toTicketMap(supportTicketRepository.save(ticket));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getFinanceSummary() {
        List<Booking> bookings = bookingRepository.findAll();
        Map<String, Property> properties = propertyRepository.findAll().stream()
                .collect(Collectors.toMap(Property::getId, property -> property, (left, right) -> left));

        BigDecimal grossRevenue = bookings.stream()
                .filter(booking -> booking.getStatus() == BookingStatus.COMPLETED)
                .map(booking -> computeTotalPrice(booking, properties.get(booking.getListingId())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal estimatedPayouts = grossRevenue.multiply(BigDecimal.valueOf(0.80));
        BigDecimal platformFees = grossRevenue.subtract(estimatedPayouts);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("grossRevenue", grossRevenue);
        response.put("estimatedPayouts", estimatedPayouts);
        response.put("platformFees", platformFees);
        response.put("currency", "USD");
        response.put("totalBookings", bookings.size());
        response.put("completedBookings", bookings.stream().filter(booking -> booking.getStatus() == BookingStatus.COMPLETED).count());
        response.put("pendingBookings", bookings.stream().filter(booking -> booking.getStatus() == BookingStatus.PENDING).count());
        response.put("cancelledBookings", bookings.stream().filter(booking -> booking.getStatus() == BookingStatus.CANCELLED).count());
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> listFinancePayouts() {
        Map<String, Property> properties = propertyRepository.findAll().stream()
                .collect(Collectors.toMap(Property::getId, property -> property, (left, right) -> left));

        return bookingRepository.findAll().stream()
                .filter(booking -> booking.getStatus() == BookingStatus.COMPLETED)
                .sorted(Comparator.comparing(Booking::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(booking -> {
                    Property listing = properties.get(booking.getListingId());
                    BigDecimal gross = computeTotalPrice(booking, listing);
                    BigDecimal payout = gross.multiply(BigDecimal.valueOf(0.80));

                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", "payout-" + booking.getId());
                    row.put("bookingId", booking.getId());
                    row.put("hostId", listing == null ? null : listing.getHostId());
                    row.put("listingId", booking.getListingId());
                    row.put("grossAmount", gross);
                    row.put("payoutAmount", payout);
                    row.put("currency", "USD");
                    row.put("status", "ready");
                    row.put("createdAt", booking.getCreatedAt());
                    return row;
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> listFinanceRefunds() {
        Map<String, Property> properties = propertyRepository.findAll().stream()
                .collect(Collectors.toMap(Property::getId, property -> property, (left, right) -> left));

        return bookingRepository.findAll().stream()
                .filter(booking -> booking.getStatus() == BookingStatus.CANCELLED)
                .sorted(Comparator.comparing(Booking::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(booking -> {
                    Property listing = properties.get(booking.getListingId());
                    BigDecimal gross = computeTotalPrice(booking, listing);
                    BigDecimal refund = gross.multiply(BigDecimal.valueOf(0.50));

                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", "refund-" + booking.getId());
                    row.put("bookingId", booking.getId());
                    row.put("guestId", booking.getGuestId());
                    row.put("listingId", booking.getListingId());
                    row.put("refundAmount", refund);
                    row.put("currency", "USD");
                    row.put("status", "processed");
                    row.put("createdAt", booking.getCreatedAt());
                    return row;
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> listPaymentHistory() {
        Map<String, Property> properties = propertyRepository.findAll().stream()
                .collect(Collectors.toMap(Property::getId, property -> property, (left, right) -> left));

        return bookingRepository.findAll().stream()
                .sorted(Comparator.comparing(Booking::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(booking -> {
                    Property listing = properties.get(booking.getListingId());
                    BigDecimal amount = computeTotalPrice(booking, listing);
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", "payment-" + booking.getId());
                    row.put("bookingId", booking.getId());
                    row.put("guestId", booking.getGuestId());
                    row.put("hostId", listing == null ? null : listing.getHostId());
                    row.put("listingId", booking.getListingId());
                    row.put("status", booking.getStatus() == null ? "unknown" : booking.getStatus().name().toLowerCase(Locale.ROOT));
                    row.put("amount", amount);
                    row.put("currency", "USD");
                    row.put("createdAt", booking.getCreatedAt());
                    return row;
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] buildInvoiceBytes(String invoiceId) {
        Booking booking = bookingRepository.findById(invoiceId)
                .orElseThrow(() -> new NotFoundException("Invoice not found"));
        Property listing = propertyRepository.findById(booking.getListingId()).orElse(null);
        BigDecimal amount = computeTotalPrice(booking, listing);

        String content = "INVOICE\n"
                + "invoiceId=" + invoiceId + "\n"
                + "bookingId=" + booking.getId() + "\n"
                + "guestId=" + booking.getGuestId() + "\n"
                + "listingId=" + booking.getListingId() + "\n"
                + "amount=" + amount + " USD\n"
                + "createdAt=" + booking.getCreatedAt() + "\n";

        return content.getBytes(StandardCharsets.UTF_8);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportFinance(String format) {
        String normalizedFormat = normalizeRequired(format, "format").toLowerCase(Locale.ROOT);
        if (!List.of("csv", "pdf").contains(normalizedFormat)) {
            throw new IllegalArgumentException("Invalid format. Allowed values: csv, pdf");
        }

        List<Map<String, Object>> history = listPaymentHistory();
        StringBuilder builder = new StringBuilder();
        builder.append("paymentId,bookingId,guestId,hostId,status,amount,currency,createdAt\n");

        for (Map<String, Object> row : history) {
            builder.append(csv(row.get("id"))).append(',')
                    .append(csv(row.get("bookingId"))).append(',')
                    .append(csv(row.get("guestId"))).append(',')
                    .append(csv(row.get("hostId"))).append(',')
                    .append(csv(row.get("status"))).append(',')
                    .append(csv(row.get("amount"))).append(',')
                    .append(csv(row.get("currency"))).append(',')
                    .append(csv(row.get("createdAt")))
                    .append('\n');
        }

        return builder.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> revenueTrend(String from, String to, String groupBy) {
        Map<String, Property> properties = propertyRepository.findAll().stream()
                .collect(Collectors.toMap(Property::getId, property -> property, (left, right) -> left));

        Map<String, BigDecimal> grouped = new LinkedHashMap<>();
        for (Booking booking : bookingRepository.findAll()) {
            if (booking.getStatus() != BookingStatus.COMPLETED || !inRange(booking.getCreatedAt(), from, to)) {
                continue;
            }
            String key = toBucket(booking.getCreatedAt(), groupBy);
            BigDecimal amount = computeTotalPrice(booking, properties.get(booking.getListingId()));
            grouped.put(key, grouped.getOrDefault(key, BigDecimal.ZERO).add(amount));
        }

        return grouped.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("period", entry.getKey());
                    row.put("revenue", entry.getValue());
                    return row;
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> bookingTrend(String from, String to, String groupBy) {
        Map<String, Long> grouped = new LinkedHashMap<>();
        for (Booking booking : bookingRepository.findAll()) {
            if (!inRange(booking.getCreatedAt(), from, to)) {
                continue;
            }
            String key = toBucket(booking.getCreatedAt(), groupBy);
            grouped.put(key, grouped.getOrDefault(key, 0L) + 1);
        }

        return grouped.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("period", entry.getKey());
                    row.put("bookings", entry.getValue());
                    return row;
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> userGrowth(String from, String to, String groupBy) {
        Map<String, Long> grouped = new LinkedHashMap<>();
        for (User user : userRepository.findAll()) {
            if (!inRange(user.getCreatedAt(), from, to)) {
                continue;
            }
            String key = toBucket(user.getCreatedAt(), groupBy);
            grouped.put(key, grouped.getOrDefault(key, 0L) + 1);
        }

        return grouped.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("period", entry.getKey());
                    row.put("users", entry.getValue());
                    return row;
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> topCities(String from, String to, int limit) {
        Map<String, Property> properties = propertyRepository.findAll().stream()
                .collect(Collectors.toMap(Property::getId, property -> property, (left, right) -> left));

        Map<String, Long> byCity = new HashMap<>();
        for (Booking booking : bookingRepository.findAll()) {
            if (!inRange(booking.getCreatedAt(), from, to)) {
                continue;
            }
            Property listing = properties.get(booking.getListingId());
            String city = listing == null || listing.getLocation() == null || listing.getLocation().isBlank()
                    ? "Unknown"
                    : listing.getLocation().trim();
            byCity.put(city, byCity.getOrDefault(city, 0L) + 1L);
        }

        int safeLimit = Math.max(limit, 1);
        return byCity.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(safeLimit)
                .map(entry -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("city", entry.getKey());
                    row.put("bookings", entry.getValue());
                    return row;
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> conversionRate(String from, String to) {
        long users = userRepository.findAll().stream()
                .filter(user -> inRange(user.getCreatedAt(), from, to))
                .count();
        long bookings = bookingRepository.findAll().stream()
                .filter(booking -> inRange(booking.getCreatedAt(), from, to))
                .count();

        double rate = users == 0 ? 0.0 : (bookings * 100.0) / users;

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("users", users);
        response.put("bookings", bookings);
        response.put("conversionRate", rate);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> mostActiveHosts(String from, String to, int limit) {
        Map<String, Property> properties = propertyRepository.findAll().stream()
                .collect(Collectors.toMap(Property::getId, property -> property, (left, right) -> left));

        Map<String, Long> byHost = new HashMap<>();
        for (Booking booking : bookingRepository.findAll()) {
            if (!inRange(booking.getCreatedAt(), from, to)) {
                continue;
            }
            Property listing = properties.get(booking.getListingId());
            if (listing == null || listing.getHostId() == null) {
                continue;
            }
            byHost.put(listing.getHostId(), byHost.getOrDefault(listing.getHostId(), 0L) + 1L);
        }

        int safeLimit = Math.max(limit, 1);
        return byHost.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(safeLimit)
                .map(entry -> {
                    User host = userRepository.findById(entry.getKey()).orElse(null);
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("hostId", entry.getKey());
                    row.put("hostName", host == null ? null : host.getName());
                    row.put("bookings", entry.getValue());
                    return row;
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> complaintCategories(String from, String to) {
        Map<String, Long> grouped = new HashMap<>();
        for (AdminReport report : adminReportRepository.findAll()) {
            if (!inRange(report.getCreatedAt(), from, to)) {
                continue;
            }
            String category = report.getReason() == null || report.getReason().isBlank() ? "unknown" : report.getReason().trim();
            grouped.put(category, grouped.getOrDefault(category, 0L) + 1L);
        }

        return grouped.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(entry -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("category", entry.getKey());
                    row.put("count", entry.getValue());
                    return row;
                })
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getSettings() {
        AdminSettings settings = getOrCreateSettings();
        return toSettingsMap(settings);
    }

    @Override
    public Map<String, Object> updateSettings(Map<String, Object> payload) {
        AdminSettings settings = getOrCreateSettings();

        if (payload.containsKey("commissionPercentage")) {
            settings.setCommissionPercentage(toDouble(payload.get("commissionPercentage"), settings.getCommissionPercentage()));
        }
        if (payload.containsKey("currency")) {
            settings.setCurrency(toStringValue(payload.get("currency"), settings.getCurrency()));
        }
        if (payload.containsKey("language")) {
            settings.setLanguage(toStringValue(payload.get("language"), settings.getLanguage()));
        }
        if (payload.containsKey("emailNotifications")) {
            settings.setEmailNotifications(toBoolean(payload.get("emailNotifications"), settings.getEmailNotifications()));
        }
        if (payload.containsKey("inAppNotifications")) {
            settings.setInAppNotifications(toBoolean(payload.get("inAppNotifications"), settings.getInAppNotifications()));
        }
        if (payload.containsKey("enableSmartPricing")) {
            settings.setEnableSmartPricing(toBoolean(payload.get("enableSmartPricing"), settings.getEnableSmartPricing()));
        }
        if (payload.containsKey("enableNewHostOnboarding")) {
            settings.setEnableNewHostOnboarding(toBoolean(payload.get("enableNewHostOnboarding"), settings.getEnableNewHostOnboarding()));
        }
        if (payload.containsKey("maintenanceMode")) {
            settings.setMaintenanceMode(toBoolean(payload.get("maintenanceMode"), settings.getMaintenanceMode()));
        }
        if (payload.containsKey("branding")) {
            settings.setBranding(toMap(payload.get("branding")));
        }
        if (payload.containsKey("emailConfig")) {
            settings.setEmailConfig(toMap(payload.get("emailConfig")));
        }
        if (payload.containsKey("smsConfig")) {
            settings.setSmsConfig(toMap(payload.get("smsConfig")));
        }

        settings.setUpdatedAt(Instant.now());
        return toSettingsMap(adminSettingsRepository.save(settings));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getContent() {
        AdminContent content = getOrCreateContent();
        return toContentMap(content);
    }

    @Override
    public Map<String, Object> updateContent(Map<String, Object> payload) {
        AdminContent content = getOrCreateContent();

        if (payload.containsKey("homeBanner")) {
            content.setHomeBanner(toMap(payload.get("homeBanner")));
        }
        if (payload.containsKey("faq")) {
            content.setFaq(toMap(payload.get("faq")));
        }
        if (payload.containsKey("terms")) {
            content.setTerms(toStringValue(payload.get("terms"), content.getTerms()));
        }
        if (payload.containsKey("privacyPolicy")) {
            content.setPrivacyPolicy(toStringValue(payload.get("privacyPolicy"), content.getPrivacyPolicy()));
        }
        if (payload.containsKey("footerContact")) {
            content.setFooterContact(toMap(payload.get("footerContact")));
        }

        content.setUpdatedAt(Instant.now());
        return toContentMap(adminContentRepository.save(content));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> listNotificationTemplates() {
        List<AdminNotificationTemplate> templates = adminNotificationTemplateRepository.findAll();
        if (templates.isEmpty()) {
            AdminNotificationTemplate seeded = adminNotificationTemplateRepository.save(AdminNotificationTemplate.builder()
                    .name("General Announcement")
                    .channel("in_app")
                    .subject("Platform update")
                    .body("We have a new update for all users.")
                    .active(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build());
            templates = List.of(seeded);
        }

        return templates.stream()
                .sorted(Comparator.comparing(AdminNotificationTemplate::getUpdatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(template -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("id", template.getId());
                    row.put("name", template.getName());
                    row.put("channel", template.getChannel());
                    row.put("subject", template.getSubject());
                    row.put("body", template.getBody());
                    row.put("active", template.getActive());
                    row.put("createdAt", template.getCreatedAt());
                    row.put("updatedAt", template.getUpdatedAt());
                    return row;
                })
                .toList();
    }

    @Override
    public Map<String, Object> sendNotification(Map<String, Object> payload, String actedBy) {
        String channel = toStringValue(payload.get("channel"), "in_app");
        String subject = toStringValue(payload.get("subject"), "Notification");
        String body = toStringValue(payload.get("body"), "");

        AdminNotificationHistory saved = adminNotificationHistoryRepository.save(AdminNotificationHistory.builder()
                .type("send")
                .channel(channel)
                .subject(subject)
                .body(body)
                .status("sent")
                .createdAt(Instant.now())
                .scheduledAt(null)
                .sentAt(Instant.now())
                .actedBy(actedBy)
                .metadata(toMap(payload.get("metadata")))
                .build());

        return toNotificationHistoryMap(saved);
    }

    @Override
    public Map<String, Object> scheduleNotification(Map<String, Object> payload, String actedBy) {
        String channel = toStringValue(payload.get("channel"), "in_app");
        String subject = toStringValue(payload.get("subject"), "Scheduled notification");
        String body = toStringValue(payload.get("body"), "");
        Instant scheduledAt = parseInstant(toStringValue(payload.get("scheduledAt"), null));

        AdminNotificationHistory saved = adminNotificationHistoryRepository.save(AdminNotificationHistory.builder()
                .type("schedule")
                .channel(channel)
                .subject(subject)
                .body(body)
                .status("scheduled")
                .createdAt(Instant.now())
                .scheduledAt(scheduledAt == null ? Instant.now().plus(1, ChronoUnit.HOURS) : scheduledAt)
                .sentAt(null)
                .actedBy(actedBy)
                .metadata(toMap(payload.get("metadata")))
                .build());

        return toNotificationHistoryMap(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> notificationHistory() {
        return adminNotificationHistoryRepository.findAll().stream()
                .sorted(Comparator.comparing(AdminNotificationHistory::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toNotificationHistoryMap)
                .toList();
    }

    private Map<String, Map<String, Object>> buildFlaggedConversations() {
        List<String> bannedKeywords = List.of("scam", "fraud", "hate", "abuse", "spam", "threat", "fake", "refund now");

        Map<String, Map<String, Object>> byConversation = new LinkedHashMap<>();
        for (Message message : messageRepository.findAll()) {
            String content = message.getContent() == null ? "" : message.getContent().toLowerCase(Locale.ROOT);
            List<String> flags = bannedKeywords.stream()
                    .filter(content::contains)
                    .toList();

            if (flags.isEmpty()) {
                continue;
            }

            String conversationId = buildConversationId(message.getSenderId(), message.getReceiverId());
            Map<String, Object> conversation = byConversation.computeIfAbsent(conversationId, key -> {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("conversationId", key);
                row.put("participants", List.of(message.getSenderId(), message.getReceiverId()));
                row.put("flaggedMessages", new ArrayList<Map<String, Object>>());
                row.put("severity", "low");
                row.put("lastFlagAt", message.getCreatedAt());
                row.put("status", "flagged");
                return row;
            });

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> flaggedMessages = (List<Map<String, Object>>) conversation.get("flaggedMessages");

            Map<String, Object> flagged = new LinkedHashMap<>();
            flagged.put("messageId", message.getId());
            flagged.put("senderId", message.getSenderId());
            flagged.put("receiverId", message.getReceiverId());
            flagged.put("content", message.getContent());
            flagged.put("createdAt", message.getCreatedAt());
            flagged.put("flags", flags);
            flaggedMessages.add(flagged);

            conversation.put("lastFlagAt", maxInstant((Instant) conversation.get("lastFlagAt"), message.getCreatedAt()));

            int size = flaggedMessages.size();
            if (size >= 5) {
                conversation.put("severity", "high");
            } else if (size >= 3) {
                conversation.put("severity", "medium");
            } else {
                conversation.put("severity", "low");
            }

            String status = adminChatModerationActionRepository.findTopByConversationIdOrderByActedAtDesc(conversationId)
                    .map(AdminChatModerationAction::getStatus)
                    .orElse("flagged");
            conversation.put("status", status);
        }

        return byConversation;
    }

    private String buildConversationId(String firstUser, String secondUser) {
        String first = firstUser == null ? "" : firstUser;
        String second = secondUser == null ? "" : secondUser;
        if (first.compareTo(second) > 0) {
            return second + "_" + first;
        }
        return first + "_" + second;
    }

    private Map<String, Object> toReportMap(AdminReport report) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", report.getId());
        row.put("createdAt", report.getCreatedAt());
        row.put("reporterId", report.getReporterId());
        row.put("targetType", report.getTargetType());
        row.put("targetId", report.getTargetId());
        row.put("reason", report.getReason());
        row.put("severity", report.getSeverity());
        row.put("status", report.getStatus());
        row.put("evidence", safeList(report.getEvidence()));
        row.put("internalNotes", safeList(report.getInternalNotes()));
        row.put("decision", report.getDecision());
        row.put("actedBy", report.getActedBy());
        row.put("actedAt", report.getActedAt());
        row.put("actionReason", report.getActionReason());
        row.put("metadata", report.getMetadata() == null ? Map.of() : report.getMetadata());
        return row;
    }

    private Map<String, Object> toTicketMap(SupportTicket ticket) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", ticket.getId());
        row.put("requesterId", ticket.getRequesterId());
        row.put("subject", ticket.getSubject());
        row.put("priority", ticket.getPriority());
        row.put("status", ticket.getStatus());
        row.put("assigneeId", ticket.getAssigneeId());
        row.put("createdAt", ticket.getCreatedAt());
        row.put("updatedAt", ticket.getUpdatedAt());
        row.put("messages", safeList(ticket.getMessages()));
        return row;
    }

    private Map<String, Object> toSettingsMap(AdminSettings settings) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("commissionPercentage", settings.getCommissionPercentage());
        row.put("currency", settings.getCurrency());
        row.put("language", settings.getLanguage());
        row.put("emailNotifications", settings.getEmailNotifications());
        row.put("inAppNotifications", settings.getInAppNotifications());
        row.put("enableSmartPricing", settings.getEnableSmartPricing());
        row.put("enableNewHostOnboarding", settings.getEnableNewHostOnboarding());
        row.put("maintenanceMode", settings.getMaintenanceMode());
        row.put("branding", settings.getBranding() == null ? Map.of() : settings.getBranding());
        row.put("emailConfig", settings.getEmailConfig() == null ? Map.of() : settings.getEmailConfig());
        row.put("smsConfig", settings.getSmsConfig() == null ? Map.of() : settings.getSmsConfig());
        row.put("updatedAt", settings.getUpdatedAt());
        return row;
    }

    private Map<String, Object> toContentMap(AdminContent content) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("homeBanner", content.getHomeBanner() == null ? Map.of() : content.getHomeBanner());
        row.put("faq", content.getFaq() == null ? Map.of() : content.getFaq());
        row.put("terms", content.getTerms());
        row.put("privacyPolicy", content.getPrivacyPolicy());
        row.put("footerContact", content.getFooterContact() == null ? Map.of() : content.getFooterContact());
        row.put("updatedAt", content.getUpdatedAt());
        return row;
    }

    private Map<String, Object> toNotificationHistoryMap(AdminNotificationHistory history) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", history.getId());
        row.put("type", history.getType());
        row.put("channel", history.getChannel());
        row.put("subject", history.getSubject());
        row.put("body", history.getBody());
        row.put("status", history.getStatus());
        row.put("createdAt", history.getCreatedAt());
        row.put("scheduledAt", history.getScheduledAt());
        row.put("sentAt", history.getSentAt());
        row.put("actedBy", history.getActedBy());
        row.put("metadata", history.getMetadata() == null ? Map.of() : history.getMetadata());
        return row;
    }

    private AdminSettings getOrCreateSettings() {
        return adminSettingsRepository.findById(SETTINGS_ID)
                .orElseGet(() -> adminSettingsRepository.save(AdminSettings.builder().id(SETTINGS_ID).build()));
    }

    private AdminContent getOrCreateContent() {
        return adminContentRepository.findById(CONTENT_ID)
                .orElseGet(() -> adminContentRepository.save(AdminContent.builder().id(CONTENT_ID).build()));
    }

    private BigDecimal computeTotalPrice(Booking booking, Property listing) {
        if (listing == null || listing.getPricePerNight() == null || booking.getCheckInDate() == null || booking.getCheckOutDate() == null) {
            return BigDecimal.ZERO;
        }

        long days = Math.max(1, ChronoUnit.DAYS.between(booking.getCheckInDate(), booking.getCheckOutDate()));
        int guests = booking.getGuests() == null || booking.getGuests() < 1 ? 1 : booking.getGuests();

        return listing.getPricePerNight()
                .multiply(BigDecimal.valueOf(days))
                .multiply(BigDecimal.valueOf(guests));
    }

    private boolean inRange(Instant value, String from, String to) {
        if (value == null) {
            return false;
        }

        Instant fromInstant = parseDateBound(from, true);
        Instant toInstant = parseDateBound(to, false);

        boolean afterFrom = fromInstant == null || !value.isBefore(fromInstant);
        boolean beforeTo = toInstant == null || !value.isAfter(toInstant);
        return afterFrom && beforeTo;
    }

    private Instant parseDateBound(String raw, boolean isStart) {
        if (raw == null || raw.isBlank()) {
            return null;
        }

        try {
            return Instant.parse(raw);
        } catch (DateTimeParseException ignored) {
            try {
                LocalDate date = LocalDate.parse(raw);
                if (isStart) {
                    return date.atStartOfDay().toInstant(ZoneOffset.UTC);
                }
                return date.plusDays(1).atStartOfDay().minusSeconds(1).toInstant(ZoneOffset.UTC);
            } catch (DateTimeParseException ex) {
                throw new IllegalArgumentException("Invalid date format. Use yyyy-MM-dd or ISO instant");
            }
        }
    }

    private Instant parseInstant(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return Instant.parse(value);
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("Invalid instant format. Use ISO-8601 instant");
        }
    }

    private String toBucket(Instant instant, String groupBy) {
        if (instant == null) {
            return "unknown";
        }

        String normalized = groupBy == null || groupBy.isBlank() ? "month" : groupBy.trim().toLowerCase(Locale.ROOT);
        return switch (normalized) {
            case "day" -> instant.atZone(ZoneOffset.UTC).toLocalDate().toString();
            case "month" -> instant.atZone(ZoneOffset.UTC).toLocalDate().toString().substring(0, 7);
            default -> instant.atZone(ZoneOffset.UTC).toLocalDate().toString().substring(0, 7);
        };
    }

    private String normalizeRequired(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(field + " is required");
        }
        return value.trim();
    }

    private String toStringValue(Object value, String fallback) {
        if (value == null) {
            return fallback;
        }
        String converted = String.valueOf(value).trim();
        return converted.isBlank() ? fallback : converted;
    }

    private Double toDouble(Object value, Double fallback) {
        if (value == null) {
            return fallback;
        }
        if (value instanceof Number number) {
            return number.doubleValue();
        }
        try {
            return Double.parseDouble(String.valueOf(value));
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Invalid numeric value: " + value);
        }
    }

    private Boolean toBoolean(Object value, Boolean fallback) {
        if (value == null) {
            return fallback;
        }
        if (value instanceof Boolean bool) {
            return bool;
        }
        return Boolean.parseBoolean(String.valueOf(value));
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> toMap(Object value) {
        if (value == null) {
            return Map.of();
        }
        if (value instanceof Map<?, ?> map) {
            return map.entrySet().stream()
                    .collect(Collectors.toMap(entry -> String.valueOf(entry.getKey()), Map.Entry::getValue));
        }
        if (value instanceof String text && text.isBlank()) {
            return Map.of();
        }
        throw new IllegalArgumentException("Expected object/map payload");
    }

    private <T> List<T> safeList(List<T> value) {
        return value == null ? List.of() : value;
    }

    private String csv(Object value) {
        if (value == null) {
            return "";
        }
        String text = String.valueOf(value).replace("\"", "\"\"");
        if (text.contains(",") || text.contains("\n") || text.contains("\"")) {
            return "\"" + text + "\"";
        }
        return text;
    }

    private Instant maxInstant(Instant first, Instant second) {
        if (first == null) {
            return second;
        }
        if (second == null) {
            return first;
        }
        return first.isAfter(second) ? first : second;
    }
}
