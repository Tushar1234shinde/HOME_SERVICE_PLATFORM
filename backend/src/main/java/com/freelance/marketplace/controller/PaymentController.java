package com.freelance.marketplace.controller;

import com.freelance.marketplace.dto.ApiResponse;
import com.freelance.marketplace.dto.PaymentRequest;
import com.freelance.marketplace.dto.PaymentResponse;
import com.freelance.marketplace.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<PaymentResponse>> createPayment(@Valid @RequestBody PaymentRequest request) {
        PaymentResponse response = paymentService.processMockPayment(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Payment successful and held in Escrow"));
    }

    @PostMapping("/{orderId}/release")
    public ResponseEntity<ApiResponse<PaymentResponse>> releasePayment(@PathVariable UUID orderId) {
        PaymentResponse response = paymentService.releasePaymentFromEscrow(orderId);
        return ResponseEntity.ok(ApiResponse.success(response, "Payment released from Escrow successfully"));
    }
}
