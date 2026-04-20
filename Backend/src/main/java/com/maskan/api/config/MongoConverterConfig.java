package com.maskan.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.data.mongodb.core.convert.MongoCustomConversions;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Configuration
public class MongoConverterConfig {

    @Bean
    public MongoCustomConversions mongoCustomConversions() {
        return new MongoCustomConversions(List.of(
                new SafeStringToBooleanConverter(),
                new SafeStringToIntegerConverter(),
                new SafeStringToInstantConverter()
        ));
    }

    @ReadingConverter
    static class SafeStringToBooleanConverter implements Converter<String, Boolean> {
        @Override
        public Boolean convert(String source) {
            if (!StringUtils.hasText(source)) {
                return Boolean.FALSE;
            }

            String normalized = source.trim().toLowerCase();
            return switch (normalized) {
                case "true", "1", "yes", "y", "on" -> Boolean.TRUE;
                default -> Boolean.FALSE;
            };
        }
    }

    @ReadingConverter
    static class SafeStringToIntegerConverter implements Converter<String, Integer> {
        @Override
        public Integer convert(String source) {
            if (!StringUtils.hasText(source)) {
                return 0;
            }

            try {
                return Integer.parseInt(source.trim());
            } catch (NumberFormatException exception) {
                return 0;
            }
        }
    }

    @ReadingConverter
    static class SafeStringToInstantConverter implements Converter<String, Instant> {
        @Override
        public Instant convert(String source) {
            if (!StringUtils.hasText(source)) {
                return null;
            }

            try {
                return Instant.parse(source.trim());
            } catch (Exception exception) {
                return null;
            }
        }
    }
}
