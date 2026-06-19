package com.maskan.api.controller;

import com.maskan.api.dto.PhoneOtpSendRequest;
import com.maskan.api.dto.PhoneOtpSendResponse;
import com.maskan.api.dto.PhoneOtpVerifyRequest;
import com.maskan.api.dto.SendOtpRequest;
import com.maskan.api.dto.VerificationSummaryResponse;
import com.maskan.api.dto.VerifyOtpRequest;
import com.maskan.api.entity.User;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.GuestVerificationService;
import com.maskan.api.service.PhoneVerificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/verifications/guest")
@RequiredArgsConstructor
public class VerificationController {

    private final UserRepository userRepository;
    private final PhoneVerificationService phoneVerificationService;
    private final GuestVerificationService guestVerificationService;

    @GetMapping("/status")
    public ResponseEntity<VerificationSummaryResponse> getStatus(@AuthenticationPrincipal UserDetails userDetails) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.ok(toSummary(user));
    }

    @PostMapping("/email/send-otp")
    public ResponseEntity<Void> sendEmailOtp(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody(required = false) SendOtpRequest request
    ) {
        getCurrentUser(userDetails);
        throw new IllegalArgumentException("Utilisez /api/verifications/email/send-otp");
    }

    @PostMapping("/email/verify-otp")
    public ResponseEntity<VerificationSummaryResponse> verifyEmailOtp(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody VerifyOtpRequest request
    ) {
        getCurrentUser(userDetails);
        throw new IllegalArgumentException("Utilisez /api/verifications/email/verify-otp");
    }

    @PostMapping("/phone/send-otp")
    public ResponseEntity<PhoneOtpSendResponse> sendPhoneOtp(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PhoneOtpSendRequest request
    ) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.ok(phoneVerificationService.sendOtp(user, request.getPhoneNumber()));
    }

    @PostMapping("/phone/verify-otp")
    public ResponseEntity<VerificationSummaryResponse> verifyPhoneOtp(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PhoneOtpVerifyRequest request
    ) {
        User user = getCurrentUser(userDetails);
        return ResponseEntity.ok(phoneVerificationService.verifyOtp(user, request.getReqId(), request.getCode()));
    }

    @PostMapping("/identity")
    public ResponseEntity<VerificationSummaryResponse> submitIdentity(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("governmentIds") List<MultipartFile> governmentIds,
            @RequestParam(value = "otherAttachments", required = false) List<MultipartFile> otherAttachments,
            @RequestParam("selfie") MultipartFile selfie
    ) {
        User user = getCurrentUser(userDetails);
        guestVerificationService.submitIdentity(user, governmentIds, otherAttachments, selfie);
        User saved = userRepository.findById(user.getId()).orElse(user);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(toSummary(saved));
    }

    private User getCurrentUser(UserDetails userDetails) {
        if (userDetails == null || !StringUtils.hasText(userDetails.getUsername())) {
            throw new UsernameNotFoundException("Authenticated user not found");
        }

        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user not found"));
    }

    private VerificationSummaryResponse toSummary(User user) {
        String identityStatus = StringUtils.hasText(user.getIdentityStatus()) ? user.getIdentityStatus() : "not_verified";
        Integer level = user.getVerificationLevel() == null ? 0 : user.getVerificationLevel();

        return VerificationSummaryResponse.builder()
                .emailVerified(Boolean.TRUE.equals(user.getEmailVerified()))
                .phoneVerified(Boolean.TRUE.equals(user.getPhoneVerified()))
                .identityStatus(identityStatus)
                .verificationLevel(level)
                .rejectionReason(user.getRejectionReason())
                .build();
    }
}
