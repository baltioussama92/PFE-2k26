package com.maskan.api.controller;

import com.maskan.api.dto.MessageRequest;
import com.maskan.api.dto.MessageResponse;
import com.maskan.api.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> send(@Valid @RequestBody MessageRequest request,
                                                @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(messageService.send(request, principal.getUsername()));
    }

    @GetMapping("/inbox")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponse>> inbox(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(messageService.inbox(principal.getUsername()));
    }

    @GetMapping("/outbox")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MessageResponse>> outbox(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(messageService.outbox(principal.getUsername()));
    }
}

