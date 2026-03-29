package com.freelance.marketplace.repository;

import com.freelance.marketplace.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByVendorId(UUID vendorId);
}
