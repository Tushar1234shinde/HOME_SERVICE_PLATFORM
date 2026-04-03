package com.freelance.marketplace.dto;

import com.freelance.marketplace.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    private UUID userId;
    private String name;
    private String email;
    private Role role;
    private String profileImageUrl;
}
