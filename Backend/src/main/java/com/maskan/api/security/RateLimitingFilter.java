package com.maskan.api.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final long WINDOW_MS = 60_000;
    private static final int LOGIN_LIMIT = 5;
    private static final int OTP_LIMIT = 3;

    private final Map<String, SimpleRateLimiter> loginLimiters = new ConcurrentHashMap<>();
    private final Map<String, SimpleRateLimiter> otpLimiters = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        if (isLoginRequest(request)) {
            if (!allowRequest(loginLimiters, request, LOGIN_LIMIT)) {
                writeRateLimitResponse(response, "Too many login attempts. Please try again later.");
                return;
            }
        }

        if (isEmailOtpRequest(request)) {
            if (!allowRequest(otpLimiters, request, OTP_LIMIT)) {
                writeRateLimitResponse(response, "Too many OTP requests. Please try again later.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean allowRequest(Map<String, SimpleRateLimiter> limiters,
                                 HttpServletRequest request,
                                 int limit) {
        String key = resolveClientKey(request);
        SimpleRateLimiter limiter = limiters.computeIfAbsent(
                key,
                ignored -> new SimpleRateLimiter(limit, WINDOW_MS)
        );
        return limiter.tryAcquire();
    }

    private boolean isLoginRequest(HttpServletRequest request) {
        return isPost(request) && "/api/auth/login".equals(request.getRequestURI());
    }

    private boolean isEmailOtpRequest(HttpServletRequest request) {
        return isPost(request) && "/api/verifications/email/send-otp".equals(request.getRequestURI());
    }

    private boolean isPost(HttpServletRequest request) {
        return "POST".equalsIgnoreCase(request.getMethod());
    }

    private String resolveClientKey(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            String first = forwarded.split(",")[0].trim();
            if (!first.isBlank()) {
                return first;
            }
        }
        return request.getRemoteAddr();
    }

    private void writeRateLimitResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(429);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(Map.of("message", message)));
    }
}
