package com.maskan.api.entity;

import com.fasterxml.jackson.annotation.JsonCreator;

import java.util.Locale;

public enum HostDemandStatus {
    PENDING,
    APPROVED,
    REJECTED,
    VERIFIED;

    /**
     * Backward compatibility for legacy records where status was stored as VERIFIED.
     */
    @JsonCreator
    public static HostDemandStatus fromValue(String rawValue) {
        if (rawValue == null || rawValue.isBlank()) {
            return PENDING;
        }
        String normalized = rawValue.trim().toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case "VERIFIED" -> VERIFIED;
            case "APPROVED" -> APPROVED;
            case "REJECTED" -> REJECTED;
            case "PENDING" -> PENDING;
            default -> PENDING;
        };
    }

    public HostDemandStatus normalized() {
        return this == VERIFIED ? APPROVED : this;
    }
}
