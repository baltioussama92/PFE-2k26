package com.maskan.api.service.impl;

import com.maskan.api.dto.MessageRequest;
import com.maskan.api.dto.MessageResponse;
import com.maskan.api.entity.Message;
import com.maskan.api.entity.User;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.MessageRepository;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    @Override
    public MessageResponse send(MessageRequest request, String email) {
        User sender = getUserByEmail(email);
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new NotFoundException("Receiver not found"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .build();

        Message saved = messageRepository.save(message);
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> inbox(String email) {
        User user = getUserByEmail(email);
        return messageRepository.findByReceiverIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MessageResponse> outbox(String email) {
        User user = getUserByEmail(email);
        return messageRepository.findBySenderIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    private MessageResponse toResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .senderId(message.getSender() != null ? message.getSender().getId() : null)
                .receiverId(message.getReceiver() != null ? message.getReceiver().getId() : null)
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .build();
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }
}

