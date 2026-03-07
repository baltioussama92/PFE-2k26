package com.maskan.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

@Value
public class MessageRequest {
    @NotNull
    String receiverId;

    @NotBlank
    String content;
}

