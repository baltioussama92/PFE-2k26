package com.maskan.api.repository;

import com.maskan.api.entity.AdminChatModerationAction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AdminChatModerationActionRepository extends MongoRepository<AdminChatModerationAction, String> {
    Optional<AdminChatModerationAction> findTopByConversationIdOrderByActedAtDesc(String conversationId);
    List<AdminChatModerationAction> findByConversationIdOrderByActedAtDesc(String conversationId);
}
