package com.freelance.marketplace.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PaymentRequest {
    @NotNull(message = "Order ID is required")
    private UUID orderId;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;
    
    // In a real app, this would contain Stripe/Razorpay tokens
    private String paymentMethodToken;
}
