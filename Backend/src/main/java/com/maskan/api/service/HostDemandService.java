package com.maskan.api.service;

import com.maskan.api.entity.HostDemand;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface HostDemandService {
    HostDemand submitDemand(String userId, String fullName, String email, String phone, String proposedLocation, Double proposedPricePerNight, MultipartFile idDocument, List<MultipartFile> housePictures);
    List<HostDemand> getAllDemands(String status);
    HostDemand getDemandById(String id);
    HostDemand updateStatus(String id, String status);
}
