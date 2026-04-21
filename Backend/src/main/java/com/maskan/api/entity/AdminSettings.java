package com.maskan.api.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "admin_settings")
public class AdminSettings {

    @Id
    private String id;

    @Builder.Default
    private Double commissionPercentage = 10.0;

    @Builder.Default
    private String currency = "USD";

    @Builder.Default
    private String language = "en";

    @Builder.Default
    private Boolean emailNotifications = true;

    @Builder.Default
    private Boolean inAppNotifications = true;

    @Builder.Default
    private Boolean enableSmartPricing = false;

    @Builder.Default
    private Boolean enableNewHostOnboarding = true;

    @Builder.Default
    private Boolean maintenanceMode = false;

    @Builder.Default
    private Map<String, Object> branding = Map.of();

    @Builder.Default
    private Map<String, Object> emailConfig = Map.of();

    @Builder.Default
    private Map<String, Object> smsConfig = Map.of();

    @Builder.Default
    private Instant updatedAt = Instant.now();
}
