package com.freelance.marketplace.dto;

import com.freelance.marketplace.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Provide a valid email")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotNull(message = "Role is required (CLIENT or VENDOR)")
    private Role role;
    
    // Optional field, used if role is VENDOR
    private String description;
}
