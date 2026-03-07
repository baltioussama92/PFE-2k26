package com.example.houserental.dto;

import com.example.houserental.entity.Role;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class UserDto {
    String id;
    String name;
    String email;
    Role role;
}
