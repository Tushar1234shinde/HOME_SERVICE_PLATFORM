package com.freelance.marketplace.dto;

import com.freelance.marketplace.entity.Order;
import com.freelance.marketplace.entity.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class OrderResponse {
    private UUID id;
    private UUID clientId;
    private String clientName;
    private UUID vendorId;
    private String vendorName;
    private UUID serviceGigId;
    private String serviceTitle;
    private OrderStatus status;
    private BigDecimal price;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static OrderResponse fromEntity(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .clientId(order.getClient().getId())
                .clientName(order.getClient().getName())
                .vendorId(order.getVendor().getId())
                .vendorName(order.getVendor().getUser().getName())
                .serviceGigId(order.getServiceGig().getId())
                .serviceTitle(order.getServiceGig().getTitle())
                .status(order.getStatus())
                .price(order.getPrice())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
