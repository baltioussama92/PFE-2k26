package com.maskan.api.repository;

import com.maskan.api.entity.AdminReport;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdminReportRepository extends MongoRepository<AdminReport, String> {
}
