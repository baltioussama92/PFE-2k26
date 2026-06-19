package com.maskan.api.service.impl;

import com.maskan.api.dto.UserDto;
import com.maskan.api.entity.GuestVerification;
import com.maskan.api.entity.GuestVerificationStatus;
import com.maskan.api.entity.NotificationType;
import com.maskan.api.entity.User;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.GuestVerificationRepository;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.GuestVerificationService;
import com.maskan.api.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class GuestVerificationServiceImpl implements GuestVerificationService {

    private static final Path GUEST_UPLOAD_ROOT = Paths.get("uploads", "guest-verifications");

    private final GuestVerificationRepository guestVerificationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    public GuestVerification submitIdentity(
            User user,
            List<MultipartFile> governmentIds,
            List<MultipartFile> otherAttachments,
            MultipartFile selfie
    ) {
        if (governmentIds == null || governmentIds.isEmpty() || governmentIds.stream().allMatch(MultipartFile::isEmpty)) {
            throw new IllegalArgumentException("At least one government ID file is required");
        }
        if (selfie == null || selfie.isEmpty()) {
            throw new IllegalArgumentException("Selfie file is required");
        }

        List<String> savedGovernmentIds = storeFiles(user.getId(), governmentIds, "government-id");
        List<String> savedAttachments = storeFiles(user.getId(), otherAttachments, "attachment");
        String savedSelfie = storeSingleFile(user.getId(), selfie, "selfie");
        Instant submittedAt = Instant.now();

        GuestVerification verification = guestVerificationRepository.findByUserId(user.getId())
                .orElseGet(GuestVerification::new);
        verification.setUserId(user.getId());
        verification.setStatus(GuestVerificationStatus.PENDING);
        verification.setGovernmentIdFiles(savedGovernmentIds);
        verification.setOtherAttachmentFiles(savedAttachments);
        verification.setSelfieFile(savedSelfie);
        verification.setSubmittedAt(submittedAt);
        verification.setReviewedAt(null);
        verification.setRejectionReason(null);

        GuestVerification savedVerification = guestVerificationRepository.save(verification);

        user.setIdentityStatus("pending");
        user.setRejectionReason(null);
        user.setGovernmentIdFiles(savedGovernmentIds);
        user.setOtherAttachmentFiles(savedAttachments);
        user.setSelfieFile(savedSelfie);
        user.setIdentitySubmittedAt(submittedAt);
        applyDerivedVerificationLevel(user);
        userRepository.save(user);

        return savedVerification;
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> listPendingForAdmin() {
        return guestVerificationRepository.findByStatus(GuestVerificationStatus.PENDING).stream()
                .sorted(Comparator.comparing(GuestVerification::getSubmittedAt, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::toAdminUserDto)
                .toList();
    }

    @Override
    public UserDto approve(String userId) {
        GuestVerification verification = guestVerificationRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Guest verification not found"));

        if (verification.getGovernmentIdFiles() == null || verification.getGovernmentIdFiles().isEmpty()
                || verification.getSelfieFile() == null || verification.getSelfieFile().isBlank()) {
            throw new IllegalArgumentException("User has not submitted identity documents");
        }

        verification.setStatus(GuestVerificationStatus.APPROVED);
        verification.setReviewedAt(Instant.now());
        verification.setRejectionReason(null);
        guestVerificationRepository.save(verification);

        User user = getUserById(userId);
        user.setIdentityStatus("approved");
        user.setVerificationLevel(3);
        user.setIsVerified(Boolean.TRUE);
        user.setRejectionReason(null);
        User updated = userRepository.save(user);

        notificationService.sendInternalNotification(
                updated.getId(),
                "Verification Approved",
                "Your identity verification has been approved.",
                NotificationType.KYC
        );
        return toDto(updated);
    }

    @Override
    public UserDto reject(String userId, String reason) {
        GuestVerification verification = guestVerificationRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Guest verification not found"));

        String rejectionReason = (reason == null || reason.isBlank())
                ? "Verification rejected by admin"
                : reason.trim();

        verification.setStatus(GuestVerificationStatus.REJECTED);
        verification.setReviewedAt(Instant.now());
        verification.setRejectionReason(rejectionReason);
        guestVerificationRepository.save(verification);

        User user = getUserById(userId);
        user.setIdentityStatus("rejected");
        user.setVerificationLevel(Boolean.TRUE.equals(user.getPhoneVerified()) ? 2
                : Boolean.TRUE.equals(user.getEmailVerified()) ? 1 : 0);
        user.setIsVerified(Boolean.FALSE);
        user.setRejectionReason(rejectionReason);
        User updated = userRepository.save(user);

        notificationService.sendInternalNotification(
                updated.getId(),
                "Verification Rejected",
                "Your identity verification was rejected. " + user.getRejectionReason(),
                NotificationType.KYC
        );
        return toDto(updated);
    }

    private UserDto toAdminUserDto(GuestVerification verification) {
        User user = userRepository.findById(verification.getUserId())
                .orElseThrow(() -> new NotFoundException("User not found for guest verification"));

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
                .identityStatus(verification.getStatus().name().toLowerCase())
                .verificationLevel(user.getVerificationLevel())
                .rejectionReason(verification.getRejectionReason())
                .governmentIdFiles(verification.getGovernmentIdFiles())
                .otherAttachmentFiles(verification.getOtherAttachmentFiles())
                .selfieFile(verification.getSelfieFile())
                .identitySubmittedAt(verification.getSubmittedAt())
                .build();
    }

    private User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));
    }

    private List<String> storeFiles(String userId, List<MultipartFile> files, String prefix) {
        List<String> savedPaths = new ArrayList<>();
        if (files == null || files.isEmpty()) {
            return savedPaths;
        }

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            savedPaths.add(storeSingleFile(userId, file, prefix));
        }

        return savedPaths;
    }

    private String storeSingleFile(String userId, MultipartFile file, String prefix) {
        try {
            Path userFolder = GUEST_UPLOAD_ROOT.resolve(userId);
            Files.createDirectories(userFolder);

            String safeOriginalName = sanitizeFilename(file.getOriginalFilename());
            String extension = "";
            int dotIndex = safeOriginalName.lastIndexOf('.');
            if (dotIndex >= 0) {
                extension = safeOriginalName.substring(dotIndex);
            }

            String filename = prefix + "-" + UUID.randomUUID() + extension;
            Path destination = userFolder.resolve(filename);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            return destination.toString().replace('\\', '/');
        } catch (IOException ex) {
            throw new IllegalArgumentException("Failed to store uploaded file");
        }
    }

    private String sanitizeFilename(String originalName) {
        String value = StringUtils.hasText(originalName) ? originalName : "file";
        return value.replaceAll("[^a-zA-Z0-9._-]", "_");
    }

    private void applyDerivedVerificationLevel(User user) {
        String identityStatus = StringUtils.hasText(user.getIdentityStatus()) ? user.getIdentityStatus() : "not_verified";
        if ("approved".equalsIgnoreCase(identityStatus)) {
            user.setVerificationLevel(3);
            return;
        }

        if (Boolean.TRUE.equals(user.getPhoneVerified())) {
            user.setVerificationLevel(2);
            return;
        }

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            user.setVerificationLevel(1);
            return;
        }

        user.setVerificationLevel(0);
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
