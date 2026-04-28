package com.maskan.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Value;

@Value
public class UpdateUserProfileRequest {
    @NotBlank
    String fullName;

    String username;

    String phone;

    @Size(max = 2000, message = "Bio is too long")
    String bio;

    String city;

    @Size(max = 400000, message = "Avatar payload is too large")
    String avatar;
}
