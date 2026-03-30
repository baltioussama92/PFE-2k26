package com.maskan.api.service;

import com.maskan.api.dto.UpdateUserProfileRequest;
import com.maskan.api.dto.UserDto;

import java.util.List;

public interface UserService {
    UserDto getMe(String email);
    UserDto updateMe(String email, UpdateUserProfileRequest request);
    List<UserDto> searchUsers(String query, String currentUserEmail);
}
