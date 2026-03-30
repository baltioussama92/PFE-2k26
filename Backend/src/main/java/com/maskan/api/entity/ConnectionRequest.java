package com.maskan.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "connection_requests")
public class ConnectionRequest {

    @Id
    private String id;

    private String requesterId;

    private String receiverId;

    @Builder.Default
    private ConnectionStatus status = ConnectionStatus.PENDING;

    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant respondedAt;
}
