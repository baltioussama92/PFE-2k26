package com.maskan.api.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
public class PropertyImageController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/images")
    @PreAuthorize("hasAnyRole('HOST','PROPRIETOR','ADMIN')")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file,
                                                            @AuthenticationPrincipal UserDetails principal) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File is empty"));
        }

        String originalName = StringUtils.cleanPath(file.getOriginalFilename() == null ? "image" : file.getOriginalFilename());
        String extension = "";
        int dot = originalName.lastIndexOf('.');
        if (dot >= 0) {
            extension = originalName.substring(dot);
        }

        Path targetDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(targetDirectory);

        String generatedName = Instant.now().toEpochMilli() + "-" + UUID.randomUUID() + extension;
        Path targetFile = targetDirectory.resolve(generatedName);
        Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);

        String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(generatedName)
                .toUriString();

        Map<String, String> response = new HashMap<>();
        response.put("fileName", generatedName);
        response.put("url", fileUrl);
        response.put("uploadedBy", principal.getUsername());

        return ResponseEntity.status(201).body(response);
    }
}
