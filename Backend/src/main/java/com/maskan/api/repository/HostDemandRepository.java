package com.maskan.api.repository;

import com.maskan.api.entity.HostDemand;
import com.maskan.api.entity.HostDemandStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostDemandRepository extends MongoRepository<HostDemand, String> {
    List<HostDemand> findByStatus(HostDemandStatus status);

    List<HostDemand> findByUserId(String userId);
}
