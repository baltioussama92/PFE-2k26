package com.maskan.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "guest_verifications")
public class GuestVerification {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Builder.Default
    private GuestVerificationStatus status = GuestVerificationStatus.PENDING;

    @Builder.Default
    private List<String> governmentIdFiles = List.of();

    @Builder.Default
    private List<String> otherAttachmentFiles = List.of();

    private String selfieFile;

    private Instant submittedAt;

    private Instant reviewedAt;

    private String rejectionReason;
}
