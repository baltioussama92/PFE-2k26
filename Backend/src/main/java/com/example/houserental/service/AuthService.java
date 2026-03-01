package com.example.houserental.service;

import com.example.houserental.dto.AuthResponse;
import com.example.houserental.dto.LoginRequest;
import com.example.houserental.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
