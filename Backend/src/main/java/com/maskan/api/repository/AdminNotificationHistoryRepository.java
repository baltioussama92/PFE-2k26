package com.maskan.api.repository;

import com.maskan.api.entity.AdminNotificationHistory;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdminNotificationHistoryRepository extends MongoRepository<AdminNotificationHistory, String> {
}
