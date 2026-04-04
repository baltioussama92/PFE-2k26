package com.maskan.api.dto;

import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class VerificationSummaryResponse {
    Boolean emailVerified;
    Boolean phoneVerified;
    String identityStatus;
    Integer verificationLevel;
    String rejectionReason;
}
