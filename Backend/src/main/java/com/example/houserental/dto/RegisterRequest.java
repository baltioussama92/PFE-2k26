package com.example.houserental.dto;

import com.example.houserental.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Value;

@Value
public class RegisterRequest {
    @NotBlank
    String name;

    @Email
    @NotBlank
    String email;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    String password;

    @NotNull
    Role role;
}
