package com.maskan.api.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import java.util.regex.Pattern;

@Service
@Slf4j
public class MoceanSmsService {

    private static final Pattern E164_PHONE_PATTERN = Pattern.compile("^\\+[1-9]\\d{7,14}$");
    private static final String SUCCESS_STATUS = "0";
    private static final String VERIFY_REQUEST_URL = "https://rest.moceanapi.com/rest/2/verify/req/sms";
    private static final String VERIFY_CHECK_URL = "https://rest.moceanapi.com/rest/2/verify/check";

    private final String apiKey;
    private final String apiSecret;
    private final String apiToken;
    private final String brand;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final AtomicReference<Map<String, Object>> lastDebugSnapshot = new AtomicReference<>(new LinkedHashMap<>());

    public MoceanSmsService(
            @Value("${mocean.api.key}") String apiKey,
            @Value("${mocean.api.secret}") String apiSecret,
            @Value("${mocean.api.token:}") String apiToken,
            @Value("${mocean.verify.brand:Maskan}") String brand
    ) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.apiToken = apiToken;
        this.brand = brand;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String sendOtp(String phoneNumber) {
        validateCredentials();
        String sanitizedPhoneNumber = sanitizeAndValidatePhoneForMocean(phoneNumber);
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("mocean-to", sanitizedPhoneNumber);
        form.add("mocean-brand", brand);
        form.add("mocean-code-length", "4");
        form.add("mocean-resp-format", "json");

        Map<String, Object> payload = postForm(VERIFY_REQUEST_URL, form);

        Object status = payload.get("status");
        Object reqId = payload.get("reqid");
        log.info("Mocean verify request response: status={}, reqId={}, to={}", status, reqId, sanitizedPhoneNumber);
        updateDebugSnapshot("send", sanitizedPhoneNumber, reqId, status, payload, null);

        if (!SUCCESS_STATUS.equals(String.valueOf(status)) || !StringUtils.hasText(String.valueOf(reqId))) {
            String message = resolveMoceanError(payload, "Unable to send OTP. Please verify phone number and try again.");
            updateDebugSnapshot("send", sanitizedPhoneNumber, reqId, status, payload, message);
            throw new IllegalArgumentException(message);
        }

        return String.valueOf(reqId);
    }

    public boolean checkOtp(String reqId, String code) {
        validateCredentials();
        if (!StringUtils.hasText(reqId)) {
            throw new IllegalArgumentException("Request ID (reqId) is required");
        }
        if (!StringUtils.hasText(code) || !code.trim().matches("\\d{4}")) {
            throw new IllegalArgumentException("OTP code must contain exactly 4 digits");
        }

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("mocean-reqid", reqId.trim());
        form.add("mocean-code", code.trim());
        form.add("mocean-resp-format", "json");

        Map<String, Object> payload = postForm(VERIFY_CHECK_URL, form);
        Object status = payload.get("status");
        log.info("Mocean verify check response: status={}, reqId={}", status, reqId.trim());
        updateDebugSnapshot("check", null, reqId.trim(), status, payload, null);
        if (!SUCCESS_STATUS.equals(String.valueOf(status))) {
            String message = resolveMoceanError(payload, "Incorrect OTP code");
            updateDebugSnapshot("check", null, reqId.trim(), status, payload, message);
            throw new IllegalArgumentException(message);
        }
        return true;
    }

    public Map<String, Object> getLastDebugSnapshot() {
        Map<String, Object> current = lastDebugSnapshot.get();
        return current == null ? Map.of() : Map.copyOf(current);
    }

    private String sanitizeAndValidatePhoneForMocean(String phoneNumber) {
        String sanitized = StringUtils.hasText(phoneNumber)
                ? phoneNumber.trim().replace(" ", "")
                : "";

        if (!E164_PHONE_PATTERN.matcher(sanitized).matches()) {
            throw new IllegalArgumentException("Phone number must be in E.164 format (example: +216XXXXXXXX)");
        }

        return sanitized.substring(1);
    }

    private void validateCredentials() {
        String resolvedToken = resolveApiToken();
        if (StringUtils.hasText(resolvedToken)) {
            return;
        }

        if (!StringUtils.hasText(apiKey) || !StringUtils.hasText(apiSecret)) {
            throw new IllegalStateException("Mocean credentials are not configured");
        }
    }

    private Map<String, Object> postForm(String url, MultiValueMap<String, String> form) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML));

        String resolvedToken = resolveApiToken();
        if (StringUtils.hasText(resolvedToken)) {
            headers.setBearerAuth(resolvedToken);
        } else {
            form.add("mocean-api-key", apiKey.trim());
            form.add("mocean-api-secret", apiSecret.trim());
        }

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, new HttpEntity<>(form, headers), String.class);
            String body = response.getBody();
            if (!StringUtils.hasText(body)) {
                throw new IllegalStateException("Empty response from Mocean Verify API");
            }
            return objectMapper.readValue(body, new TypeReference<>() {});
        } catch (HttpStatusCodeException ex) {
            log.warn("Mocean HTTP error on {}: status={}, body={}", url, ex.getStatusCode().value(), ex.getResponseBodyAsString());
            String message = resolveMoceanError(ex.getResponseBodyAsString(),
                    "Mocean request failed with status " + ex.getStatusCode().value());
            updateDebugSnapshot("http-error", null, null, ex.getStatusCode().value(), Map.of("rawBody", ex.getResponseBodyAsString()), message);
            throw new IllegalArgumentException(message);
        } catch (RestClientException ex) {
            updateDebugSnapshot("network-error", null, null, null, Map.of(), "Unable to reach Mocean Verify API");
            throw new IllegalStateException("Unable to reach Mocean Verify API. Check network and credentials.", ex);
        } catch (Exception ex) {
            updateDebugSnapshot("parse-error", null, null, null, Map.of(), "Unable to parse Mocean Verify API response");
            throw new IllegalStateException("Unable to parse Mocean Verify API response", ex);
        }
    }

    private void updateDebugSnapshot(
            String phase,
            Object phone,
            Object reqId,
            Object status,
            Map<String, Object> payload,
            String errorMessage
    ) {
        Map<String, Object> snapshot = new LinkedHashMap<>();
        snapshot.put("timestamp", Instant.now().toString());
        snapshot.put("phase", phase);
        snapshot.put("phone", phone);
        snapshot.put("reqId", reqId);
        snapshot.put("status", status);
        snapshot.put("error", errorMessage);
        snapshot.put("payload", payload == null ? Map.of() : payload);
        lastDebugSnapshot.set(snapshot);
    }

    private String resolveMoceanError(Map<String, Object> payload, String fallback) {
        if (payload == null || payload.isEmpty()) {
            return fallback;
        }

        String message = firstNonBlank(
                payload.get("message"),
                payload.get("error"),
                payload.get("err_msg"),
                payload.get("msg")
        );

        Object status = payload.get("status");
        if (StringUtils.hasText(message)) {
            message = message.replace('+', ' ');
            return StringUtils.hasText(String.valueOf(status)) ? "Mocean error " + status + ": " + message : message;
        }

        return fallback;
    }

    private String resolveMoceanError(String rawBody, String fallback) {
        if (!StringUtils.hasText(rawBody)) {
            return fallback;
        }

        try {
            Map<String, Object> payload = objectMapper.readValue(rawBody, new TypeReference<>() {});
            return resolveMoceanError(payload, fallback);
        } catch (Exception ignored) {
            return fallback;
        }
    }

    private String firstNonBlank(Object... values) {
        for (Object value : values) {
            if (value != null && StringUtils.hasText(String.valueOf(value))) {
                return String.valueOf(value);
            }
        }
        return "";
    }

    private String resolveApiToken() {
        if (StringUtils.hasText(apiToken)) {
            return apiToken.trim();
        }
        if (StringUtils.hasText(apiSecret) && apiSecret.trim().startsWith("apit-")) {
            return apiSecret.trim();
        }
        if (StringUtils.hasText(apiKey) && apiKey.trim().startsWith("apit-")) {
            return apiKey.trim();
        }
        return "";
    }
}
