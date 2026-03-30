package com.maskan.api.service.impl;

import com.maskan.api.dto.ConnectionRequestResponse;
import com.maskan.api.entity.ConnectionRequest;
import com.maskan.api.entity.ConnectionStatus;
import com.maskan.api.entity.User;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.ConnectionRequestRepository;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.ConnectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ConnectionServiceImpl implements ConnectionService {

    private final ConnectionRequestRepository connectionRequestRepository;
    private final UserRepository userRepository;

    @Override
    public ConnectionRequestResponse sendRequest(String requesterEmail, String targetUserId) {
        User requester = findByEmail(requesterEmail);
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new NotFoundException("Target user not found"));

        if (requester.getId().equals(target.getId())) {
            throw new IllegalArgumentException("Cannot send connection request to yourself");
        }

        if (areUsersConnected(requester.getId(), target.getId())) {
            throw new IllegalArgumentException("Users are already connected");
        }

        connectionRequestRepository.findByRequesterIdAndReceiverId(requester.getId(), target.getId())
                .ifPresent(existing -> {
                    if (existing.getStatus() == ConnectionStatus.PENDING) {
                        throw new IllegalArgumentException("Connection request already pending");
                    }
                });

        ConnectionRequest request = ConnectionRequest.builder()
                .requesterId(requester.getId())
                .receiverId(target.getId())
                .status(ConnectionStatus.PENDING)
                .build();

        return toResponse(connectionRequestRepository.save(request));
    }

    @Override
    public ConnectionRequestResponse acceptRequest(String requestId, String receiverEmail) {
        User receiver = findByEmail(receiverEmail);
        ConnectionRequest request = connectionRequestRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Connection request not found"));

        if (!receiver.getId().equals(request.getReceiverId())) {
            throw new IllegalArgumentException("Not authorized to accept this request");
        }

        if (request.getStatus() != ConnectionStatus.PENDING) {
            throw new IllegalArgumentException("Only pending requests can be accepted");
        }

        request.setStatus(ConnectionStatus.ACCEPTED);
        request.setRespondedAt(Instant.now());

        return toResponse(connectionRequestRepository.save(request));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConnectionRequestResponse> listPendingRequests(String userEmail) {
        User user = findByEmail(userEmail);
        return connectionRequestRepository.findByReceiverIdAndStatusOrderByCreatedAtDesc(user.getId(), ConnectionStatus.PENDING)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConnectionRequestResponse> listUserConnections(String userEmail) {
        User user = findByEmail(userEmail);
        return connectionRequestRepository.findByRequesterIdOrReceiverIdOrderByCreatedAtDesc(user.getId(), user.getId())
                .stream()
                .filter(request -> request.getStatus() == ConnectionStatus.ACCEPTED)
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean areUsersConnected(String userAId, String userBId) {
        if (userAId == null || userBId == null) {
            return false;
        }
        if (userAId.equals(userBId)) {
            return true;
        }

        return connectionRequestRepository.existsByStatusAndRequesterIdAndReceiverId(ConnectionStatus.ACCEPTED, userAId, userBId)
                || connectionRequestRepository.existsByStatusAndRequesterIdAndReceiverId(ConnectionStatus.ACCEPTED, userBId, userAId);
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private ConnectionRequestResponse toResponse(ConnectionRequest request) {
        return ConnectionRequestResponse.builder()
                .id(request.getId())
                .requesterId(request.getRequesterId())
                .receiverId(request.getReceiverId())
                .status(request.getStatus())
                .createdAt(request.getCreatedAt())
                .respondedAt(request.getRespondedAt())
                .build();
    }
}
