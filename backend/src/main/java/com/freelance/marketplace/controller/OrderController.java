package com.freelance.marketplace.controller;

import com.freelance.marketplace.dto.ApiResponse;
import com.freelance.marketplace.dto.OrderRequest;
import com.freelance.marketplace.dto.OrderResponse;
import com.freelance.marketplace.entity.OrderStatus;
import com.freelance.marketplace.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@Valid @RequestBody OrderRequest orderRequest) {
        OrderResponse response = orderService.createOrder(orderRequest);
        return new ResponseEntity<>(ApiResponse.success(response, "Order created successfully"), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable UUID id) {
        OrderResponse response = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Order fetched successfully"));
    }

    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getClientOrders(@PathVariable UUID clientId) {
        List<OrderResponse> orders = orderService.getOrdersByClient(clientId);
        return ResponseEntity.ok(ApiResponse.success(orders, "Client orders fetched successfully"));
    }

    @GetMapping("/vendor/{vendorId}")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getVendorOrders(@PathVariable UUID vendorId) {
        List<OrderResponse> orders = orderService.getOrdersByVendor(vendorId);
        return ResponseEntity.ok(ApiResponse.success(orders, "Vendor orders fetched successfully"));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(@PathVariable UUID id, @RequestBody Map<String, String> statusMap) {
        String statusStr = statusMap.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Status is required"));
        }
        
        OrderStatus status = OrderStatus.valueOf(statusStr.toUpperCase());
        OrderResponse response = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success(response, "Order status updated successfully"));
    }
}
