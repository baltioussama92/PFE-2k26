package com.maskan.api.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.security.SecureRandom;

@Service
public class EmailService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public String generateOtpCode() {
        int code = 100000 + RANDOM.nextInt(900000);
        return String.valueOf(code);
    }

    public void sendOtpHtmlEmail(String recipientEmail, String otpCode) {
      String normalizedSenderEmail = normalizeEmailValue(senderEmail);
      if (!StringUtils.hasText(normalizedSenderEmail) || !normalizedSenderEmail.contains("@")) {
        throw new IllegalArgumentException("Configuration email invalide (spring.mail.username)");
      }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(recipientEmail);
        helper.setFrom(normalizedSenderEmail);
            helper.setSubject("Votre code de vérification Maskan");
            helper.setText(buildOtpHtml(otpCode), true);
            javaMailSender.send(message);
        } catch (MessagingException | MailException exception) {
        String message = exception.getMessage();
        throw new IllegalArgumentException(
            StringUtils.hasText(message)
                ? "Impossible d’envoyer le code par email: " + message
                : "Impossible d’envoyer le code par email"
        );
        }
    }

          private String normalizeEmailValue(String rawEmail) {
            if (!StringUtils.hasText(rawEmail)) {
              return "";
            }

            String normalized = rawEmail.trim();
            while (normalized.length() >= 2 && ((normalized.startsWith("\"") && normalized.endsWith("\"")) || (normalized.startsWith("'") && normalized.endsWith("'")))) {
              normalized = normalized.substring(1, normalized.length() - 1).trim();
            }
            return normalized;
          }

    private String buildOtpHtml(String otpCode) {
        return """
                <!DOCTYPE html>
                <html lang=\"fr\">
                <head>
                  <meta charset=\"UTF-8\">
                  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
                </head>
                <body style=\"margin:0;padding:0;background:#f5f2ee;font-family:Arial,sans-serif;color:#2b2b2b;\">
                  <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"padding:32px 12px;\">
                    <tr>
                      <td align=\"center\">
                        <table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"max-width:560px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e6ddd5;\">
                          <tr>
                            <td style=\"background:#A65B32;padding:24px 28px;color:#ffffff;\">
                              <h1 style=\"margin:0;font-size:24px;line-height:1.2;\">Maskan</h1>
                              <p style=\"margin:8px 0 0;font-size:14px;opacity:0.95;\">Vérification de sécurité de votre compte</p>
                            </td>
                          </tr>
                          <tr>
                            <td style=\"padding:26px 28px;\">
                              <p style=\"margin:0 0 12px;font-size:15px;line-height:1.6;\">Bonjour,</p>
                              <p style=\"margin:0 0 18px;font-size:15px;line-height:1.6;\">Utilisez ce code pour vérifier votre adresse email sur la plateforme Maskan :</p>
                              <div style=\"text-align:center;margin:16px 0 22px;\">
                                <span style=\"display:inline-block;background:#f4e7de;color:#A65B32;font-size:32px;letter-spacing:6px;font-weight:700;padding:14px 22px;border-radius:10px;border:1px solid #e3cdbf;\">__OTP_CODE__</span>
                              </div>
                              <p style=\"margin:0 0 12px;font-size:14px;color:#5f5f5f;line-height:1.6;\">Ce code expire dans <strong>15 minutes</strong>.</p>
                              <p style=\"margin:0;font-size:13px;color:#7a7a7a;line-height:1.6;\">Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet email.</p>
                            </td>
                          </tr>
                          <tr>
                            <td style=\"background:#f9f6f3;padding:14px 28px;color:#7a6f67;font-size:12px;text-align:center;\">
                              © Maskan - Plateforme de location immobilière
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
                </html>
                """.replace("__OTP_CODE__", otpCode == null ? "" : otpCode);
    }
}
