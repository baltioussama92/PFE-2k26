package com.maskan.api.dto;

import com.maskan.api.entity.Role;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthResponse {
    String token;
    Role role;
    UserDto user;
}

