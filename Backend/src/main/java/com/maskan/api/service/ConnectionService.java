package com.maskan.api.service;

import com.maskan.api.dto.ConnectionRequestResponse;

import java.util.List;

public interface ConnectionService {
    ConnectionRequestResponse sendRequest(String requesterEmail, String targetUserId);

    ConnectionRequestResponse acceptRequest(String requestId, String receiverEmail);

    List<ConnectionRequestResponse> listPendingRequests(String userEmail);

    List<ConnectionRequestResponse> listUserConnections(String userEmail);

    boolean areUsersConnected(String userAId, String userBId);
}
