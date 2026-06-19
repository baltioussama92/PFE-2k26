package com.maskan.api.dto;

public record MoceanSmsResult(
        int status,
        String errorMessage,
        String messageId,
        String receiver
) {
    public boolean isAccepted() {
        return status == 0;
    }
}
