package com.maskan.api.service.impl;

import com.maskan.api.dto.UpdateUserProfileRequest;
import com.maskan.api.dto.UserDto;
import com.maskan.api.entity.User;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDto getMe(String email) {
        User user = findByEmail(email);
        return toDto(user);
    }

    @Override
    public UserDto updateMe(String email, UpdateUserProfileRequest request) {
        User user = findByEmail(email);
        user.setName(request.getFullName());
        User updated = userRepository.save(user);
        return toDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> searchUsers(String query, String currentUserEmail) {
        String normalized = query == null ? "" : query.trim();
        if (normalized.isEmpty()) {
            return List.of();
        }

        User currentUser = findByEmail(currentUserEmail);
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(normalized, normalized)
                .stream()
                .filter(user -> !user.getId().equals(currentUser.getId()))
                .map(this::toDto)
                .toList();
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private UserDto toDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .fullName(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .isVerified(user.getIsVerified())
                .banned(user.getBanned())
                .build();
    }
}
