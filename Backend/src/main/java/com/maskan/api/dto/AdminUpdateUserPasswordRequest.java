package com.maskan.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Value;

@Value
public class AdminUpdateUserPasswordRequest {
    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    String newPassword;

    Boolean forceResetOnNextLogin;
}
