package com.example.houserental.dto;

import com.example.houserental.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

@Value
public class UpdateUserRoleRequest {
    @NotNull
    Role role;
}
