package com.maskan.api.repository;

import com.maskan.api.entity.AdminContent;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdminContentRepository extends MongoRepository<AdminContent, String> {
}
