package com.maskan.api.repository;

import com.maskan.api.entity.GuestVerification;
import com.maskan.api.entity.GuestVerificationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface GuestVerificationRepository extends MongoRepository<GuestVerification, String> {

    Optional<GuestVerification> findByUserId(String userId);

    List<GuestVerification> findByStatus(GuestVerificationStatus status);
}
