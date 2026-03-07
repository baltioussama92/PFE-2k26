package com.maskan.api.dto;

import com.maskan.api.entity.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Value;

@Value
public class UpdateUserRoleRequest {
    @NotNull
    Role role;
}

