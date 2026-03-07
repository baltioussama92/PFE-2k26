package com.maskan.api.service.impl;

import com.maskan.api.dto.UpdateUserRoleRequest;
import com.maskan.api.dto.UserDto;
import com.maskan.api.entity.User;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> listUsers() {
        return userRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public UserDto updateRole(String userId, UpdateUserRoleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        user.setRole(request.getRole());
        User updated = userRepository.save(user);
        return toDto(updated);
    }

    @Override
    public void deleteUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
        userRepository.delete(user);
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

