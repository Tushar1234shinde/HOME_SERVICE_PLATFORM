package com.freelance.marketplace.repository;

import com.freelance.marketplace.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    List<Order> findByClientId(UUID clientId);
    List<Order> findByVendorId(UUID vendorId);
}
