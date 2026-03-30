package com.maskan.api.repository;

import com.maskan.api.entity.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {
	List<Message> findByReceiverIdOrderByCreatedAtDesc(String receiverId);
	List<Message> findBySenderIdOrderByCreatedAtDesc(String senderId);
	List<Message> findBySenderIdOrReceiverIdOrderByCreatedAtDesc(String senderId, String receiverId);
	List<Message> findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByCreatedAtAsc(String senderId,
	                                                                                   String receiverId,
	                                                                                   String receiverId2,
	                                                                                   String senderId2);
	long countByReceiverId(String receiverId);
}

