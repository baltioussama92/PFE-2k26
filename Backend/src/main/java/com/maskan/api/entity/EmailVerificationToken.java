package com.maskan.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "email_verification_tokens")
public class EmailVerificationToken {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String otpCode;

    @Indexed(expireAfterSeconds = 0)
    private Instant expiryDate;
}
