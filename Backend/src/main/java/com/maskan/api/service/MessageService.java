package com.maskan.api.service;

import com.maskan.api.dto.MessageRequest;
import com.maskan.api.dto.MessageResponse;

import java.util.List;

public interface MessageService {
    MessageResponse send(MessageRequest request, String email);
    List<MessageResponse> inbox(String email);
    List<MessageResponse> outbox(String email);
}

