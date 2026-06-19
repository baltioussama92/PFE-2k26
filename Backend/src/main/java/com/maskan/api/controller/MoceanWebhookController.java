package com.maskan.api.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks/mocean")
@Slf4j
public class MoceanWebhookController {

    @PutMapping("/dlr")
    public ResponseEntity<Void> handleDeliveryReport(@RequestParam Map<String, String> params) {
        String msgId = params.get("mocean-msgid");
        String dlrStatus = params.get("mocean-dlr-status");
        String errorCode = params.get("mocean-error-code");
        String from = params.get("mocean-from");
        String to = params.get("mocean-to");

        String deliveryOutcome = describeDlrStatus(dlrStatus);
        log.info(
                "Mocean DLR received: msgid={}, dlrStatus={} ({}), errorCode={}, from={}, to={}",
                msgId,
                dlrStatus,
                deliveryOutcome,
                errorCode,
                from,
                maskPhone(to)
        );

        if ("2".equals(dlrStatus) || "3".equals(dlrStatus)) {
            log.warn(
                    "Mocean SMS delivery failed/expired: msgid={}, dlrStatus={}, errorCode={}, to={}",
                    msgId,
                    dlrStatus,
                    errorCode,
                    maskPhone(to)
            );
        }

        return ResponseEntity.ok().build();
    }

    private static String describeDlrStatus(String dlrStatus) {
        if (!StringUtils.hasText(dlrStatus)) {
            return "unknown";
        }
        return switch (dlrStatus) {
            case "1" -> "delivered";
            case "2" -> "failed";
            case "3" -> "expired";
            default -> "unknown";
        };
    }

    private static String maskPhone(String phone) {
        if (!StringUtils.hasText(phone) || phone.length() < 4) {
            return "****";
        }
        return "****" + phone.substring(phone.length() - 2);
    }
}
