package com.maskan.api.service;

import com.maskan.api.dto.UpdateUserProfileRequest;
import com.maskan.api.dto.UserDto;

public interface UserService {
    UserDto getMe(String email);
    UserDto updateMe(String email, UpdateUserProfileRequest request);
}
