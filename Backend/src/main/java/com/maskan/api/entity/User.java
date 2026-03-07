package com.maskan.api.entity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "users")
public class User {

    @Id
    private String id;

    @NotBlank
    private String fullName;

    @Email
    @NotBlank
    @Indexed(unique = true)
    private String email;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private Role role;

    @Builder.Default
    private Instant createdAt = Instant.now();

    @Builder.Default
    private Boolean isVerified = Boolean.TRUE;

    @Builder.Default
    @DBRef(lazy = true)
    private List<Property> properties = new ArrayList<>();

    @Builder.Default
    @DBRef(lazy = true)
    private List<Booking> bookings = new ArrayList<>();

    @Builder.Default
    @DBRef(lazy = true)
    private List<Review> reviews = new ArrayList<>();

    @Builder.Default
    @DBRef(lazy = true)
    private List<Message> sentMessages = new ArrayList<>();

    @Builder.Default
    @DBRef(lazy = true)
    private List<Message> receivedMessages = new ArrayList<>();

    public String getName() {
        return fullName;
    }

    public void setName(String name) {
        this.fullName = name;
    }
}

