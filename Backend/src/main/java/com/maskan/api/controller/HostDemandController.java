package com.maskan.api.controller;

import com.maskan.api.entity.HostDemand;
import com.maskan.api.entity.User;
import com.maskan.api.repository.UserRepository;
import com.maskan.api.service.HostDemandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/host-demands")
@RequiredArgsConstructor
public class HostDemandController {

    private final HostDemandService hostDemandService;
    private final UserRepository userRepository;

    @PostMapping("/submit")
    public ResponseEntity<HostDemand> submitDemand(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("fullName") String fullName,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("proposedLocation") String proposedLocation,
            @RequestParam("proposedPricePerNight") Double proposedPricePerNight,
            @RequestParam("idDocument") MultipartFile idDocument,
            @RequestParam(value = "housePictures", required = false) List<MultipartFile> housePictures
    ) {
        User user = getCurrentUser(userDetails);
        HostDemand demand = hostDemandService.submitDemand(user.getId(), fullName, email, phone, proposedLocation, proposedPricePerNight, idDocument, housePictures);
        return ResponseEntity.ok(demand);
    }

    private User getCurrentUser(UserDetails userDetails) {
        if (userDetails == null || userDetails.getUsername() == null) {
            throw new UsernameNotFoundException("Authenticated user not found");
        }
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("Authenticated user not found"));
    }
}
