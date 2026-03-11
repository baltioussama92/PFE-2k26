package com.maskan.api.entity;

import jakarta.validation.constraints.NotBlank;
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
@Document(collection = "messages")
public class Message {

    @Id
    private String id;

    @NotBlank
    private String senderId;

    @NotBlank
    private String receiverId;

    @NotBlank
    private String content;

    @Builder.Default
    private Instant createdAt = Instant.now();
}

