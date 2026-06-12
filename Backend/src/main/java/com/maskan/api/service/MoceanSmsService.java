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

import java.util.regex.Pattern;
import java.util.Map;
import java.util.List;

@Service
@Slf4j
public class MoceanSmsService {

    private static final Pattern E164_PHONE_PATTERN = Pattern.compile("^\\+[1-9]\\d{7,14}$");
    private static final String SMS_API_URL = "https://rest.moceanapi.com/rest/2/sms";

    private final String apiKey;
    private final String apiSecret;
    private final String apiToken;
    private final String brand;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

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

    public void sendSms(String phoneNumber, String text) {
        validateCredentials();
        String sanitizedPhoneNumber = sanitizeAndValidatePhoneForMocean(phoneNumber);
        
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("mocean-to", sanitizedPhoneNumber);
        form.add("mocean-from", brand);
        form.add("mocean-text", text);
        form.add("mocean-resp-format", "json");

        Map<String, Object> payload = postForm(SMS_API_URL, form);
        
        log.info("Mocean SMS response: to={}, payload={}", sanitizedPhoneNumber, payload);

        // Check if there are error statuses in the response messages
        if (payload != null && payload.containsKey("messages")) {
            List<Map<String, Object>> messages = (List<Map<String, Object>>) payload.get("messages");
            if (messages != null && !messages.isEmpty()) {
                Map<String, Object> msg = messages.get(0);
                Object statusObj = msg.get("status");
                String status = String.valueOf(statusObj);
                if (!"0".equals(status)) {
                    String err = String.valueOf(msg.get("err_msg"));
                    log.error("Failed to send SMS via Mocean: status={}, err={}", status, err);
                    throw new IllegalArgumentException("Failed to send SMS: " + err);
                }
            }
        }
    }

    private String sanitizeAndValidatePhoneForMocean(String phoneNumber) {
        String sanitized = StringUtils.hasText(phoneNumber)
                ? phoneNumber.trim().replace(" ", "")
                : "";

        if (!E164_PHONE_PATTERN.matcher(sanitized).matches()) {
            throw new IllegalArgumentException("Phone number must be in E.164 format (example: +216XXXXXXXX)");
        }

        return sanitized.substring(1); // Mocean expects without +
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
        headers.setAccept(List.of(MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML));

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
                throw new IllegalStateException("Empty response from Mocean API");
            }
            return objectMapper.readValue(body, new TypeReference<>() {});
        } catch (HttpStatusCodeException ex) {
            log.error("Mocean HTTP error on {}: status={}, body={}", url, ex.getStatusCode().value(), ex.getResponseBodyAsString());
            throw new IllegalArgumentException("Mocean API request failed with status " + ex.getStatusCode().value());
        } catch (RestClientException ex) {
            throw new IllegalStateException("Unable to reach Mocean API. Check network and credentials.", ex);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to parse Mocean API response", ex);
        }
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
