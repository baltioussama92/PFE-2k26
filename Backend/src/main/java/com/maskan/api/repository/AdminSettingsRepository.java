package com.maskan.api.repository;

import com.maskan.api.entity.AdminSettings;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdminSettingsRepository extends MongoRepository<AdminSettings, String> {
}
