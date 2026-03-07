package com.maskan.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.maskan.api.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Value;

import java.time.Instant;

@Value
@Builder
public class UserDto {
    String id;

    @NotBlank
    String fullName;

    @Email
    @NotBlank
    String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Size(min = 8, message = "Password must be at least 8 characters")
    String password;

    @NotNull
    Role role;

    Instant createdAt;
    Boolean isVerified;
}

