package com.maskan.api.service.impl;

import com.maskan.api.dto.MoceanSmsResult;
import com.maskan.api.dto.PhoneOtpSendResponse;
import com.maskan.api.dto.VerificationSummaryResponse;
import com.maskan.api.entity.User;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.MoceanSmsService;
import com.maskan.api.service.PhoneVerificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PhoneVerificationServiceImpl implements PhoneVerificationService {

    private static final Logger LOGGER = LoggerFactory.getLogger(PhoneVerificationServiceImpl.class);
    private static final long OTP_EXPIRY_MINUTES = 15;

    private final UserRepository userRepository;
    private final MoceanSmsService moceanSmsService;
    private final Map<String, PhoneOtpEntry> otpStore = new ConcurrentHashMap<>();

    public PhoneVerificationServiceImpl(UserRepository userRepository, MoceanSmsService moceanSmsService) {
        this.userRepository = userRepository;
        this.moceanSmsService = moceanSmsService;
    }

    @Override
    public PhoneOtpSendResponse sendOtp(User user, String phoneNumber) {
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        String normalizedPhone = normalizePhone(phoneNumber);
        if (!StringUtils.hasText(normalizedPhone)) {
            throw new IllegalArgumentException("Phone number is required");
        }

        String reqId = java.util.UUID.randomUUID().toString();
        String code = String.format("%04d", java.util.concurrent.ThreadLocalRandom.current().nextInt(10000));
        
        String text = "Votre code OTP Maskan est : " + code;
        MoceanSmsResult smsResult = moceanSmsService.sendSms(normalizedPhone, text);

        Instant expiresAt = Instant.now().plusSeconds(OTP_EXPIRY_MINUTES * 60);

        otpStore.put(reqId, new PhoneOtpEntry(user.getId(), normalizedPhone, code, expiresAt));
        LOGGER.info(
                "Phone OTP sent via Mocean SMS for userId={} phone={} msgid={}",
                user.getId(),
                maskPhone(normalizedPhone),
                smsResult.messageId()
        );
        return new PhoneOtpSendResponse(reqId, "OTP sent successfully");
    }

    @Override
    public VerificationSummaryResponse verifyOtp(User user, String reqId, String code) {
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        if (!StringUtils.hasText(reqId)) {
            throw new IllegalArgumentException("Request id is required");
        }

        PhoneOtpEntry entry = otpStore.get(reqId);
        if (entry == null || !entry.userId().equals(user.getId())) {
            throw new IllegalArgumentException("OTP request not found or expired");
        }

        if (entry.expiresAt().isBefore(Instant.now())) {
            otpStore.remove(reqId);
            throw new IllegalArgumentException("OTP expired");
        }

        if (!entry.code().equals(code)) {
            throw new IllegalArgumentException("Incorrect OTP code");
        }

        user.setPhone(entry.phone());
        user.setPhoneVerified(true);
        applyDerivedVerificationLevel(user);

        User saved = userRepository.save(user);
        otpStore.remove(reqId);

        return toSummary(saved);
    }

    private String normalizePhone(String phoneNumber) {
        if (!StringUtils.hasText(phoneNumber)) {
            return "";
        }

        String normalized = phoneNumber.trim().replace(" ", "").replace("-", "");
        if (normalized.startsWith("00")) {
            normalized = "+" + normalized.substring(2);
        }
        if (!normalized.startsWith("+") && normalized.matches("^0?\\d{8}$")) {
            normalized = "+216" + normalized.replaceFirst("^0", "");
        }
        return normalized;
    }

    private String maskPhone(String phoneNumber) {
        if (!StringUtils.hasText(phoneNumber) || phoneNumber.length() < 4) {
            return "****";
        }
        String tail = phoneNumber.substring(phoneNumber.length() - 2);
        return "****" + tail;
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

    private record PhoneOtpEntry(String userId, String phone, String code, Instant expiresAt) {
    }
}
