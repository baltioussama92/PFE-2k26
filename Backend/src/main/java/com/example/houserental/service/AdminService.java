package com.example.houserental.service;

import com.example.houserental.dto.UpdateUserRoleRequest;
import com.example.houserental.dto.UserDto;

import java.util.List;

public interface AdminService {
    List<UserDto> listUsers();
    UserDto updateRole(String userId, UpdateUserRoleRequest request);
    void deleteUser(String userId);
}
