package com.maskan.api.service;

import com.maskan.api.dto.UpdateUserRoleRequest;
import com.maskan.api.dto.UserDto;

import java.util.List;

public interface AdminService {
    List<UserDto> listUsers();
    UserDto updateRole(String userId, UpdateUserRoleRequest request);
    void deleteUser(String userId);
}

