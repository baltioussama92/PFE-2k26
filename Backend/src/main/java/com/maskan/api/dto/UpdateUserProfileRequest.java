package com.maskan.api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Value;

@Value
public class UpdateUserProfileRequest {
    @NotBlank
    String fullName;
}
