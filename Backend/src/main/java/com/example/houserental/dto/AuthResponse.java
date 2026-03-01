package com.example.houserental.dto;

import com.example.houserental.entity.Role;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class AuthResponse {
    String token;
    Role role;
    UserDto user;
}
