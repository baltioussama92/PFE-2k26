package com.example.houserental.service;

import com.example.houserental.dto.UpdateUserRoleRequest;
import com.example.houserental.dto.UserDto;

import java.util.List;

public interface AdminService {
    List<UserDto> listUsers();
    UserDto updateRole(Long userId, UpdateUserRoleRequest request);
    void deleteUser(Long userId);
}
