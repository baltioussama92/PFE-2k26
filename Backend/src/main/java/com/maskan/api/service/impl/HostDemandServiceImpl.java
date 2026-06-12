package com.maskan.api.service.impl;

import com.maskan.api.entity.HostDemand;
import com.maskan.api.entity.Role;
import com.maskan.api.entity.User;
import com.maskan.api.exception.NotFoundException;
import com.maskan.api.repository.HostDemandRepository;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.HostDemandService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class HostDemandServiceImpl implements HostDemandService {

    private final HostDemandRepository hostDemandRepository;
    private final UserRepository userRepository;

    private static final Path UPLOAD_DIR = Paths.get("uploads", "host-demands");

    @Override
    public HostDemand submitDemand(String userId, String fullName, String email, String phone, String proposedLocation, Double proposedPricePerNight, MultipartFile idDocument, List<MultipartFile> housePictures) {
        String idDocumentUrl = saveFile(idDocument);
        List<String> housePictureUrls = new ArrayList<>();
        if (housePictures != null) {
            for (MultipartFile pic : housePictures) {
                if (!pic.isEmpty()) {
                    housePictureUrls.add(saveFile(pic));
                }
            }
        }

        HostDemand demand = HostDemand.builder()
                .userId(userId)
                .fullName(fullName)
                .email(email)
                .phone(phone)
                .submittedDate(Instant.now())
                .idDocumentUrl(idDocumentUrl)
                .idStatus("PENDING")
                .proposedLocation(proposedLocation)
                .proposedPricePerNight(proposedPricePerNight)
                .housePictures(housePictureUrls)
                .status("PENDING")
                .build();

        return hostDemandRepository.save(demand);
    }

    @Override
    public List<HostDemand> getAllDemands(String status) {
        if (StringUtils.hasText(status)) {
            return hostDemandRepository.findByStatus(status.toUpperCase());
        }
        return hostDemandRepository.findAll();
    }

    @Override
    public HostDemand getDemandById(String id) {
        return hostDemandRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Host demand not found"));
    }

    @Override
    public HostDemand updateStatus(String id, String status) {
        HostDemand demand = getDemandById(id);
        String upperStatus = status.toUpperCase();
        demand.setStatus(upperStatus);
        
        if ("APPROVED".equals(upperStatus)) {
            demand.setIdStatus("VERIFIED");
            User user = userRepository.findById(demand.getUserId())
                    .orElseThrow(() -> new NotFoundException("User not found"));
            user.setRole(Role.HOST);
            userRepository.save(user);
        } else if ("REJECTED".equals(upperStatus)) {
            demand.setIdStatus("REJECTED");
        }

        return hostDemandRepository.save(demand);
    }

    private String saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        try {
            Files.createDirectories(UPLOAD_DIR);
            String extension = "";
            String originalName = file.getOriginalFilename();
            if (originalName != null && originalName.lastIndexOf('.') >= 0) {
                extension = originalName.substring(originalName.lastIndexOf('.'));
            }
            String generatedName = Instant.now().toEpochMilli() + "-" + UUID.randomUUID() + extension;
            Path targetFile = UPLOAD_DIR.resolve(generatedName);
            Files.copy(file.getInputStream(), targetFile, StandardCopyOption.REPLACE_EXISTING);

            return ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/uploads/host-demands/")
                    .path(generatedName)
                    .toUriString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }
}
