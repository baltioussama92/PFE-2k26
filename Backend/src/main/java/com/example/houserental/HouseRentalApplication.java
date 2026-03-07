package com.example.houserental;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = {"com.example.houserental", "com.maskan.api"})
@EnableMongoRepositories(basePackages = "com.maskan.api.repository")
public class HouseRentalApplication {

    public static void main(String[] args) {
        SpringApplication.run(HouseRentalApplication.class, args);
    }
}
