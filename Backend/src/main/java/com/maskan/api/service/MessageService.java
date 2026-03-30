package com.maskan.api.service;

import com.maskan.api.dto.MessageRequest;
import com.maskan.api.dto.MessageResponse;
import com.maskan.api.dto.ConversationSummaryResponse;

import java.util.List;

public interface MessageService {
    MessageResponse send(MessageRequest request, String email);
    List<MessageResponse> inbox(String email);
    List<MessageResponse> sent(String email);
    List<MessageResponse> conversation(String email, String otherUserId);
    List<ConversationSummaryResponse> conversations(String email);
}

