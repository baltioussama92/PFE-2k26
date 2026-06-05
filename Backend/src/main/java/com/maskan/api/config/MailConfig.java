package com.maskan.api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessagePreparator;
import org.springframework.util.StringUtils;

import java.io.InputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.Properties;

import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;

@Configuration
public class MailConfig {

    @Bean
    public JavaMailSender javaMailSender(
            @Value("${spring.mail.host:smtp.gmail.com}") String host,
            @Value("${spring.mail.port:587}") String port,
            @Value("${spring.mail.username:}") String username,
            @Value("${spring.mail.password:}") String password,
            @Value("${spring.mail.properties.mail.smtp.auth:true}") boolean auth,
            @Value("${spring.mail.properties.mail.smtp.starttls.enable:true}") boolean startTls,
            @Value("${spring.mail.properties.mail.smtp.starttls.required:true}") boolean startTlsRequired,
            @Value("${spring.mail.properties.mail.smtp.ssl.protocols:TLSv1.2 TLSv1.3}") String sslProtocols,
            @Value("${spring.mail.properties.mail.debug:false}") boolean debug,
            @Value("${spring.mail.properties.mail.smtp.connectiontimeout:5000}") String connectionTimeout,
            @Value("${spring.mail.properties.mail.smtp.timeout:5000}") String timeout,
            @Value("${spring.mail.properties.mail.smtp.writetimeout:5000}") String writeTimeout
    ) {
        JavaMailSenderImpl sender = new JavaMailSenderImpl();
        // Try resolving the host first — if DNS/Network prevents resolving the SMTP host,
        // return a no-op/logging mail sender to avoid crashing flows that attempt to send emails.
        try {
            InetAddress.getByName(fallback(host, "smtp.gmail.com"));
        } catch (UnknownHostException e) {
            System.out.println("[MailConfig] SMTP host lookup failed for '" + host + "', using LoggingMailSender fallback: " + e.getMessage());
            return new LoggingMailSender();
        }
        sender.setHost(sanitizeText(fallback(host, "smtp.gmail.com")));
        sender.setPort(parsePort(port));
        sender.setUsername(sanitizeText(safeTrim(username)));
        sender.setPassword(normalizeAppPassword(password));

        Properties properties = sender.getJavaMailProperties();
        properties.put("mail.transport.protocol", "smtp");
        properties.put("mail.smtp.auth", String.valueOf(auth));
        properties.put("mail.smtp.starttls.enable", String.valueOf(startTls));
        properties.put("mail.smtp.starttls.required", String.valueOf(startTlsRequired));
        properties.put("mail.smtp.ssl.protocols", sanitizeText(fallback(sslProtocols, "TLSv1.2 TLSv1.3")));
        properties.put("mail.debug", String.valueOf(debug));
        properties.put("mail.smtp.connectiontimeout", normalizeIntegerProperty(connectionTimeout, 5000));
        properties.put("mail.smtp.timeout", normalizeIntegerProperty(timeout, 5000));
        properties.put("mail.smtp.writetimeout", normalizeIntegerProperty(writeTimeout, 5000));

        return sender;
    }

    /**
     * A lightweight JavaMailSender implementation used in development when SMTP is unreachable.
     * It creates MimeMessage instances but logs sends instead of opening network connections.
     */
    private static class LoggingMailSender implements JavaMailSender {
        private final Session session;

        LoggingMailSender() {
            this.session = Session.getInstance(new Properties());
        }

        @Override
        public MimeMessage createMimeMessage() {
            return new MimeMessage(session);
        }

        @Override
        public MimeMessage createMimeMessage(InputStream contentStream) throws MailException {
            try {
                return new MimeMessage(session, contentStream);
            } catch (MessagingException e) {
                throw new MailException("Failed to create MimeMessage from stream: " + e.getMessage(), e) {};
            }
        }

        @Override
        public void send(MimeMessage mimeMessage) throws MailException {
            try {
                String to = mimeMessage.getAllRecipients() == null ? "<none>" : mimeMessage.getAllRecipients()[0].toString();
                String subject = mimeMessage.getSubject();
                System.out.println("[LoggingMailSender] send() called — to=" + to + " subject=" + subject);
            } catch (Exception e) {
                System.out.println("[LoggingMailSender] send() called — failed to read message metadata: " + e.getMessage());
            }
        }

        @Override
        public void send(MimeMessage... mimeMessages) throws MailException {
            for (MimeMessage m : mimeMessages) send(m);
        }

        @Override
        public void send(MimeMessagePreparator mimeMessagePreparator) throws MailException {
            MimeMessage message = createMimeMessage();
            try {
                mimeMessagePreparator.prepare(message);
            } catch (Exception e) {
                throw new MailException("Failed to prepare message: " + e.getMessage(), e) {};
            }
            send(message);
        }

        @Override
        public void send(MimeMessagePreparator... mimeMessagePreparators) throws MailException {
            for (MimeMessagePreparator p : mimeMessagePreparators) send(p);
        }

        @Override
        public void send(SimpleMailMessage simpleMessage) throws MailException {
            System.out.println("[LoggingMailSender] send(SimpleMailMessage) to=" + String.join(",", simpleMessage.getTo()) + " subject=" + simpleMessage.getSubject());
        }

        @Override
        public void send(SimpleMailMessage... simpleMessages) throws MailException {
            for (SimpleMailMessage m : simpleMessages) send(m);
        }
    }

    private int parsePort(String rawPort) {
        String value = sanitizeText(fallback(rawPort, "587"));
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException exception) {
            return 587;
        }
    }

    private String fallback(String value, String fallbackValue) {
        return StringUtils.hasText(value) ? value.trim() : fallbackValue;
    }

    private String safeTrim(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeAppPassword(String value) {
        if (value == null) {
            return "";
        }
        String normalized = value.replaceAll("\\s+", "").trim();
        return stripWrappingQuotes(normalized);
    }

    private String normalizeIntegerProperty(String value, int fallbackValue) {
        String normalized = sanitizeText(value);
        try {
            int parsed = Integer.parseInt(normalized);
            return String.valueOf(Math.max(parsed, 0));
        } catch (Exception exception) {
            return String.valueOf(fallbackValue);
        }
    }

    private String sanitizeText(String value) {
        String trimmed = safeTrim(value);
        if (!StringUtils.hasText(trimmed)) {
            return "";
        }
        return stripWrappingQuotes(trimmed);
    }

    private String stripWrappingQuotes(String value) {
        String output = value;
        while (output.length() >= 2 && ((output.startsWith("\"") && output.endsWith("\"")) || (output.startsWith("'") && output.endsWith("'")))) {
            output = output.substring(1, output.length() - 1).trim();
        }
        return output;
    }
}
