package com.maskan.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Value;

@Value
public class AdminUpdateUserRequest {
    @NotBlank
    String fullName;

    @NotBlank
    @Email
    String email;
}
