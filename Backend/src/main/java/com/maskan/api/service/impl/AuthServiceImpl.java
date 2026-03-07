package com.maskan.api.service.impl;

import com.maskan.api.dto.AuthResponse;
import com.maskan.api.dto.LoginRequest;
import com.maskan.api.dto.UserDto;
import com.maskan.api.entity.Role;
import com.maskan.api.entity.User;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.security.JwtService;
import com.maskan.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
        public AuthResponse register(UserDto request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

                if (request.getRole() == null) {
                        throw new IllegalArgumentException("Role is required");
                }

                if (request.getPassword() == null || request.getPassword().isBlank()) {
                        throw new IllegalArgumentException("Password is required");
                }

                boolean verifiedByDefault = request.getRole() == Role.TENANT;

        User user = User.builder()
                                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                                .isVerified(verifiedByDefault)
                                .createdAt(Instant.now())
                .build();

        User saved = userRepository.save(user);
        UserDetails principal = toUserDetails(saved);
        String token = jwtService.generateToken(principal);

        return AuthResponse.builder()
                .token(token)
                .role(saved.getRole())
                .user(toDto(saved))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        UserDetails principal = toUserDetails(user);
        String token = jwtService.generateToken(principal);

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole())
                .user(toDto(user))
                .build();
    }

    private UserDetails toUserDetails(User user) {
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                                .createdAt(user.getCreatedAt())
                                .isVerified(user.getIsVerified())
                .build();
    }
}

