package com.example.houserental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

@Value
public class MessageRequest {
    @NotNull
    Long receiverId;

    @NotBlank
    String content;
}
