package com.freelance.marketplace.dto;

import com.freelance.marketplace.entity.ServiceGig;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class GigResponse {
    private UUID id;
    private UUID vendorId;
    private String vendorName;
    private String title;
    private String description;
    private BigDecimal price;
    private String category;
    private LocalDateTime createdAt;

    public static GigResponse fromEntity(ServiceGig gig) {
        return GigResponse.builder()
                .id(gig.getId())
                .vendorId(gig.getVendor().getId())
                .vendorName(gig.getVendor().getUser().getName())
                .title(gig.getTitle())
                .description(gig.getDescription())
                .price(gig.getPrice())
                .category(gig.getCategory())
                .createdAt(gig.getCreatedAt())
                .build();
    }
}
