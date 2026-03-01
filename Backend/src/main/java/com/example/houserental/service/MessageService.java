package com.example.houserental.service;

import com.example.houserental.dto.MessageRequest;
import com.example.houserental.dto.MessageResponse;

import java.util.List;

public interface MessageService {
    MessageResponse send(MessageRequest request, String email);
    List<MessageResponse> inbox(String email);
    List<MessageResponse> outbox(String email);
}
