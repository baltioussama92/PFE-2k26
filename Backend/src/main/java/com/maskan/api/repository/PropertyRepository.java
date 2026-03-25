package com.maskan.api.repository;

import com.maskan.api.entity.Property;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PropertyRepository extends MongoRepository<Property, String> {
	List<Property> findByHostId(String hostId);
	List<Property> findByPendingApprovalTrue();
	long countByHostId(String hostId);
}

