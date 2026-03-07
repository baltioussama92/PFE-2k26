package com.maskan.api.controller;

import com.maskan.api.dto.UpdateUserRoleRequest;
import com.maskan.api.dto.UserDto;
import com.maskan.api.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "${app.cors.allowed-origin:http://localhost:5173}")
@RequiredArgsConstructor
@PreAuthorize("hasRole('PROPRIETOR')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> users() {
        return ResponseEntity.ok(adminService.listUsers());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<UserDto> updateRole(@PathVariable String id,
                                              @Valid @RequestBody UpdateUserRoleRequest request) {
        return ResponseEntity.ok(adminService.updateRole(id, request));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}

