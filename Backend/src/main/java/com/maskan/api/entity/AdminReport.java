package com.maskan.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "admin_reports")
public class AdminReport {

    @Id
    private String id;

    @Builder.Default
    private Instant createdAt = Instant.now();

    private String reporterId;
    private String targetType;
    private String targetId;
    private String reason;
    private String severity;

    @Builder.Default
    private String status = "open";

    @Builder.Default
    private List<String> evidence = List.of();

    @Builder.Default
    private List<InternalNote> internalNotes = List.of();

    private Decision decision;

    private String actedBy;
    private Instant actedAt;
    private String actionReason;
    private Map<String, Object> metadata;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InternalNote {
        private String id;
        private String author;
        private String note;

        @Builder.Default
        private Instant createdAt = Instant.now();
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Decision {
        private String action;
        private String actor;

        @Builder.Default
        private Instant actedAt = Instant.now();

        private Map<String, Object> metadata;
    }
}
