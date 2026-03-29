package com.freelance.marketplace.service;

import com.freelance.marketplace.dto.OrderRequest;
import com.freelance.marketplace.dto.OrderResponse;
import com.freelance.marketplace.entity.*;
import com.freelance.marketplace.exception.BadRequestException;
import com.freelance.marketplace.exception.ResourceNotFoundException;
import com.freelance.marketplace.repository.OrderRepository;
import com.freelance.marketplace.repository.PaymentRepository;
import com.freelance.marketplace.repository.ServiceGigRepository;
import com.freelance.marketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ServiceGigRepository gigRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));

        if (!Role.CLIENT.equals(client.getRole())) {
            throw new BadRequestException("Only CLIENT can create orders");
        }

        ServiceGig gig = gigRepository.findById(request.getServiceGigId())
                .orElseThrow(() -> new ResourceNotFoundException("Service Gig not found"));

        Order order = Order.builder()
                .client(client)
                .vendor(gig.getVendor())
                .serviceGig(gig)
                .price(gig.getPrice())
                .status(OrderStatus.CREATED)
                .build();

        Order savedOrder = orderRepository.save(order);
        return OrderResponse.fromEntity(savedOrder);
    }

    public OrderResponse getOrderById(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return OrderResponse.fromEntity(order);
    }

    public List<OrderResponse> getOrdersByClient(UUID clientId) {
        return orderRepository.findByClientId(clientId).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByVendor(UUID vendorId) {
        return orderRepository.findByVendorId(vendorId).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(UUID orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        // Basic status transition validation could be added here
        order.setStatus(newStatus);
        
        Order savedOrder = orderRepository.save(order);
        return OrderResponse.fromEntity(savedOrder);
    }
}
