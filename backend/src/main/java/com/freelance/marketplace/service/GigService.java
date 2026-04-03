package com.freelance.marketplace.service;

import com.freelance.marketplace.dto.GigRequest;
import com.freelance.marketplace.dto.GigResponse;
import com.freelance.marketplace.entity.ServiceGig;
import com.freelance.marketplace.entity.Vendor;
import com.freelance.marketplace.exception.ResourceNotFoundException;
import com.freelance.marketplace.repository.ServiceGigRepository;
import com.freelance.marketplace.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

@Service
@RequiredArgsConstructor
public class GigService {

    private final ServiceGigRepository gigRepository;
    private final VendorRepository vendorRepository;

    public GigResponse createGig(GigRequest request) {
        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found"));

        ServiceGig gig = ServiceGig.builder()
                .vendor(vendor)
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .build();

        ServiceGig savedGig = gigRepository.save(gig);
        return GigResponse.fromEntity(savedGig);
    }

    public Page<GigResponse> getFilteredGigs(String category, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Specification<ServiceGig> spec = com.freelance.marketplace.repository.GigSpecification.filterGigs(category, minPrice, maxPrice);
        return gigRepository.findAll(spec, pageable).map(GigResponse::fromEntity);
    }

    public GigResponse getGigById(UUID id) {
        ServiceGig gig = gigRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gig not found with id: " + id));
        return GigResponse.fromEntity(gig);
    }
}
