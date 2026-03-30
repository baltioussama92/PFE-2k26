package com.maskan.api.repository;

import com.maskan.api.entity.ConnectionRequest;
import com.maskan.api.entity.ConnectionStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRequestRepository extends MongoRepository<ConnectionRequest, String> {
    Optional<ConnectionRequest> findByRequesterIdAndReceiverId(String requesterId, String receiverId);

    List<ConnectionRequest> findByReceiverIdAndStatusOrderByCreatedAtDesc(String receiverId, ConnectionStatus status);

    List<ConnectionRequest> findByRequesterIdOrReceiverIdOrderByCreatedAtDesc(String requesterId, String receiverId);

    boolean existsByStatusAndRequesterIdAndReceiverId(ConnectionStatus status, String requesterId, String receiverId);
}
