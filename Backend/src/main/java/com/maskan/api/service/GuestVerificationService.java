package com.maskan.api.service;

import com.maskan.api.dto.UserDto;
import com.maskan.api.entity.GuestVerification;
import com.maskan.api.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface GuestVerificationService {

    GuestVerification submitIdentity(
            User user,
            List<MultipartFile> governmentIds,
            List<MultipartFile> otherAttachments,
            MultipartFile selfie
    );

    List<UserDto> listPendingForAdmin();

    UserDto approve(String userId);

    UserDto reject(String userId, String reason);
}
