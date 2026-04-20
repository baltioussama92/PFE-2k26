package com.maskan.api.repository;

import com.maskan.api.entity.EmailVerificationToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.Instant;
import java.util.Optional;

public interface EmailVerificationTokenRepository extends MongoRepository<EmailVerificationToken, String> {
    Optional<EmailVerificationToken> findByEmail(String email);

    void deleteByEmail(String email);

    void deleteByExpiryDateBefore(Instant now);
}
