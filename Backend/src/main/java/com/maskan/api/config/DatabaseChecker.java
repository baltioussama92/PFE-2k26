package com.maskan.api.config;

import com.maskan.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseChecker implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) {
        try {
            long usersCount = userRepository.count();
            log.info("✅ MASKAN DATABASE: Connection to MongoDB Compass successful. usersCount={}", usersCount);
        } catch (Exception exception) {
            log.error("❌ MASKAN DATABASE: Connection check failed.", exception);
        }
    }
}
