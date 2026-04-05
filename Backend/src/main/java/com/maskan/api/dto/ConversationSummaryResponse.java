package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class ConversationSummaryResponse {
    String userId;
    String userName;
    String lastMessageSenderId;
    String lastMessage;
    Instant lastMessageAt;
}
