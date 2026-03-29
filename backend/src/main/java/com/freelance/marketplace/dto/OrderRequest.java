package com.freelance.marketplace.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class OrderRequest {
    @NotNull(message = "Client ID is required")
    private UUID clientId;

    @NotNull(message = "Service Gig ID is required")
    private UUID serviceGigId;
}
