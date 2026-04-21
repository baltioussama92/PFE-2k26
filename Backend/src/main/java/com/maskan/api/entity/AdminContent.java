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
@Document(collection = "admin_content")
public class AdminContent {

    @Id
    private String id;

    @Builder.Default
    private Map<String, Object> homeBanner = Map.of();

    @Builder.Default
    private Map<String, Object> faq = Map.of();

    @Builder.Default
    private String terms = "";

    @Builder.Default
    private String privacyPolicy = "";

    @Builder.Default
    private Map<String, Object> footerContact = Map.of();

    @Builder.Default
    private Instant updatedAt = Instant.now();
}
