package com.maskan.api.service;

import java.util.List;
import java.util.Map;

public interface AdminWorkspaceService {

    List<Map<String, Object>> listReports();
    Map<String, Object> getReportById(String id);
    Map<String, Object> updateReportStatus(String id, String status, String internalNote, String actedBy);
    Map<String, Object> applyReportAction(String id, String action, String note, String actedBy, Map<String, Object> metadata);

    List<Map<String, Object>> listFlaggedConversations();
    Map<String, Object> getFlaggedConversation(String conversationId);
    Map<String, Object> createModerationAction(String conversationId, String action, String reason, String severity, String actedBy);

    List<Map<String, Object>> listSupportTickets();
    Map<String, Object> getSupportTicketById(String id);
    Map<String, Object> patchSupportTicket(String id, String action, String assigneeId, String reason, String actedBy);
    Map<String, Object> addSupportTicketMessage(String id, String senderId, String content, boolean internal, String actedBy);

    Map<String, Object> getFinanceSummary();
    List<Map<String, Object>> listFinancePayouts();
    List<Map<String, Object>> listFinanceRefunds();
    List<Map<String, Object>> listPaymentHistory();
    byte[] buildInvoiceBytes(String invoiceId);
    byte[] exportFinance(String format);

    List<Map<String, Object>> revenueTrend(String from, String to, String groupBy);
    List<Map<String, Object>> bookingTrend(String from, String to, String groupBy);
    List<Map<String, Object>> userGrowth(String from, String to, String groupBy);
    List<Map<String, Object>> topCities(String from, String to, int limit);
    Map<String, Object> conversionRate(String from, String to);
    List<Map<String, Object>> mostActiveHosts(String from, String to, int limit);
    List<Map<String, Object>> complaintCategories(String from, String to);

    Map<String, Object> getSettings();
    Map<String, Object> updateSettings(Map<String, Object> payload);

    Map<String, Object> getContent();
    Map<String, Object> updateContent(Map<String, Object> payload);

    List<Map<String, Object>> listNotificationTemplates();
    Map<String, Object> sendNotification(Map<String, Object> payload, String actedBy);
    Map<String, Object> scheduleNotification(Map<String, Object> payload, String actedBy);
    List<Map<String, Object>> notificationHistory();
}
