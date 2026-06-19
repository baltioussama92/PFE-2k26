package com.maskan.api.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.maskan.api.dto.MoceanSmsResult;
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
    private final boolean dlrEnabled;
    private final String dlrUrl;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public MoceanSmsService(
            @Value("${mocean.api.key}") String apiKey,
            @Value("${mocean.api.secret}") String apiSecret,
            @Value("${mocean.api.token:}") String apiToken,
            @Value("${mocean.verify.brand:Maskan}") String brand,
            @Value("${mocean.dlr.enabled:false}") boolean dlrEnabled,
            @Value("${mocean.dlr.url:}") String dlrUrl
    ) {
        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.apiToken = apiToken;
        this.brand = brand;
        this.dlrEnabled = dlrEnabled;
        this.dlrUrl = dlrUrl;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public MoceanSmsResult sendSms(String phoneNumber, String text) {
        validateCredentials();
        validateSenderId(brand);
        String sanitizedPhoneNumber = sanitizeAndValidatePhoneForMocean(phoneNumber);

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("mocean-to", sanitizedPhoneNumber);
        form.add("mocean-from", brand);
        form.add("mocean-text", text);
        form.add("mocean-resp-format", "json");
        form.add("mocean-charset", "UTF-8");

        if (dlrEnabled) {
            if (!StringUtils.hasText(dlrUrl)) {
                throw new IllegalStateException("mocean.dlr.url must be set when mocean.dlr.enabled=true");
            }
            form.add("mocean-dlr-mask", "1");
            form.add("mocean-dlr-url", dlrUrl.trim());
            log.debug("Mocean DLR enabled, callback={}", dlrUrl.trim());
        }

        log.info(
                "Mocean SMS request: to={}, from={}, dlrEnabled={}",
                sanitizedPhoneNumber,
                brand,
                dlrEnabled
        );

        Map<String, Object> payload = postForm(SMS_API_URL, form);
        MoceanSmsResult result = parseSmsResponse(sanitizedPhoneNumber, payload);
        logSmsResult(result);

        if (!result.isAccepted()) {
            throw new IllegalArgumentException("Failed to send SMS: " + result.errorMessage());
        }

        return result;
    }

    private MoceanSmsResult parseSmsResponse(String sanitizedPhoneNumber, Map<String, Object> payload) {
        if (payload == null || !payload.containsKey("messages")) {
            log.warn("Mocean SMS response missing messages array for to={}", sanitizedPhoneNumber);
            return new MoceanSmsResult(-1, "Unexpected Mocean response format", null, sanitizedPhoneNumber);
        }

        List<Map<String, Object>> messages = (List<Map<String, Object>>) payload.get("messages");
        if (messages == null || messages.isEmpty()) {
            log.warn("Mocean SMS response has empty messages array for to={}", sanitizedPhoneNumber);
            return new MoceanSmsResult(-1, "Empty messages array in Mocean response", null, sanitizedPhoneNumber);
        }

        Map<String, Object> msg = messages.get(0);
        int status = parseStatus(msg.get("status"));
        String errMsg = msg.containsKey("err_msg") ? String.valueOf(msg.get("err_msg")) : null;
        String msgId = msg.containsKey("msgid") ? String.valueOf(msg.get("msgid")) : null;
        String receiver = msg.containsKey("receiver")
                ? String.valueOf(msg.get("receiver"))
                : sanitizedPhoneNumber;

        return new MoceanSmsResult(status, errMsg, msgId, receiver);
    }

    private void logSmsResult(MoceanSmsResult result) {
        if (result.isAccepted()) {
            log.info(
                    "Mocean SMS accepted (not yet delivered): status={}, msgid={}, receiver={}. "
                            + "Use DLR or Mocean dashboard to confirm carrier delivery.",
                    result.status(),
                    result.messageId(),
                    result.receiver()
            );
            return;
        }

        log.error(
                "Mocean SMS rejected: status={}, err_msg={}, receiver={}",
                result.status(),
                result.errorMessage(),
                result.receiver()
        );
    }

    private int parseStatus(Object statusObj) {
        if (statusObj instanceof Number number) {
            return number.intValue();
        }
        try {
            return Integer.parseInt(String.valueOf(statusObj));
        } catch (NumberFormatException ex) {
            return -1;
        }
    }

    private String sanitizeAndValidatePhoneForMocean(String phoneNumber) {
        String sanitized = StringUtils.hasText(phoneNumber)
                ? phoneNumber.trim().replace(" ", "")
                : "";

        if (sanitized.startsWith("00")) {
            sanitized = "+" + sanitized.substring(2);
        }

        if (!sanitized.startsWith("+") && sanitized.matches("^[1-9]\\d{7,14}$")) {
            sanitized = "+" + sanitized;
        }

        if (!E164_PHONE_PATTERN.matcher(sanitized).matches()) {
            throw new IllegalArgumentException("Phone number must be in E.164 format (example: +216XXXXXXXX)");
        }

        return sanitized.substring(1);
    }

    private void validateSenderId(String senderId) {
        if (!StringUtils.hasText(senderId)) {
            throw new IllegalStateException("Mocean sender ID (mocean.verify.brand) is not configured");
        }
        if (senderId.length() > 11) {
            throw new IllegalStateException("Mocean sender ID must be at most 11 characters");
        }
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
            log.debug("Mocean raw HTTP response: status={}, body={}", response.getStatusCode().value(), body);
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
