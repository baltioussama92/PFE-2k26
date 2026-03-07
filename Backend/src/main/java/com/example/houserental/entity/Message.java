package com.example.houserental.entity;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
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
    private String content;

    @DBRef(lazy = true)
    private User sender;

    @DBRef(lazy = true)
    private User receiver;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
