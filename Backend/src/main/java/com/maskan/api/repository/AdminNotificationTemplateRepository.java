package com.maskan.api.repository;

import com.maskan.api.entity.AdminNotificationTemplate;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdminNotificationTemplateRepository extends MongoRepository<AdminNotificationTemplate, String> {
}
