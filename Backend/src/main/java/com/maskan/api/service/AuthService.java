package com.maskan.api.service;

import com.maskan.api.dto.AuthResponse;
import com.maskan.api.dto.LoginRequest;
import com.maskan.api.dto.UserDto;

public interface AuthService {
    AuthResponse register(UserDto request);
    AuthResponse login(LoginRequest request);
    UserDto getCurrentUser(String email);
}

