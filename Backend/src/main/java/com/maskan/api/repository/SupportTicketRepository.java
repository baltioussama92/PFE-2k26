package com.maskan.api.repository;

import com.maskan.api.entity.SupportTicket;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SupportTicketRepository extends MongoRepository<SupportTicket, String> {
}
