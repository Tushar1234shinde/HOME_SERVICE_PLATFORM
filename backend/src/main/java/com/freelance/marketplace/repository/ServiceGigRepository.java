package com.freelance.marketplace.repository;

import com.freelance.marketplace.entity.ServiceGig;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ServiceGigRepository extends JpaRepository<ServiceGig, UUID> {
    List<ServiceGig> findByVendorId(UUID vendorId);
    List<ServiceGig> findByCategoryIgnoreCase(String category);
}
