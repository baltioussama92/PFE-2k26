package com.maskan.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Value;

@Value
public class UpdateUserProfileRequest {
    @NotBlank
    String fullName;

    @Size(max = 400000, message = "Avatar payload is too large")
    String avatar;

    String phone;

    @Size(max = 500, message = "Bio must not exceed 500 characters")
    String bio;

    String username;

    String city;
}
