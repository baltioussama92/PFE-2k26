package com.maskan.api.service.impl;

import com.maskan.api.dto.UpdateUserProfileRequest;
import com.maskan.api.dto.UpdateMyPasswordRequest;
import com.maskan.api.dto.UserDto;
import com.maskan.api.entity.User;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }
        if (request.getAvatar() != null) {
            user.setAvatar(request.getAvatar());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }
        User updated = userRepository.save(user);
        return toDto(updated);
    }

    @Override
    public void updateMyPassword(String email, UpdateMyPasswordRequest request) {
        User user = findByEmail(email);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
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
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .isVerified(user.getIsVerified())
                .banned(user.getBanned())
                .avatar(user.getAvatar())
                .phone(user.getPhone())
                .bio(user.getBio())
                .city(user.getCity())
                .emailVerified(user.getEmailVerified())
                .phoneVerified(user.getPhoneVerified())
                .identityStatus(user.getIdentityStatus())
                .verificationLevel(user.getVerificationLevel())
                .rejectionReason(user.getRejectionReason())
                .governmentIdFiles(user.getGovernmentIdFiles())
                .otherAttachmentFiles(user.getOtherAttachmentFiles())
                .selfieFile(user.getSelfieFile())
                .identitySubmittedAt(user.getIdentitySubmittedAt())
                .build();
    }
}
