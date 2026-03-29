package com.freelance.marketplace.service;

import com.freelance.marketplace.dto.PaymentRequest;
import com.freelance.marketplace.dto.PaymentResponse;
import com.freelance.marketplace.entity.*;
import com.freelance.marketplace.exception.BadRequestException;
import com.freelance.marketplace.exception.ResourceNotFoundException;
import com.freelance.marketplace.repository.OrderRepository;
import com.freelance.marketplace.repository.PaymentRepository;
import com.freelance.marketplace.repository.TransactionRepository;
import com.freelance.marketplace.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final TransactionRepository transactionRepository;
    private final VendorRepository vendorRepository;

    @Transactional
    public PaymentResponse processMockPayment(PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getStatus().equals(OrderStatus.CREATED)) {
            throw new BadRequestException("Order is not in CREATED state. Cannot process payment.");
        }

        if (order.getPrice().compareTo(request.getAmount()) != 0) {
            throw new BadRequestException("Payment amount must match order price exactly.");
        }

        // Mock Escrow Payment
        Payment payment = Payment.builder()
                .order(order)
                .amount(request.getAmount())
                .status(PaymentStatus.HELD)
                .build();
        payment = paymentRepository.save(payment);

        // Record Client Debit Transaction
        Transaction clientDebit = Transaction.builder()
                .user(order.getClient())
                .type(TransactionType.DEBIT)
                .amount(request.getAmount())
                .referenceId(payment.getId())
                .build();
        transactionRepository.save(clientDebit);

        // Update order status to PAID
        order.setStatus(OrderStatus.PAID);
        orderRepository.save(order);

        return PaymentResponse.fromEntity(payment);
    }

    @Transactional
    public PaymentResponse releasePaymentFromEscrow(UUID orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getStatus().equals(OrderStatus.APPROVED)) {
            throw new BadRequestException("Order must be APPROVED before releasing payment.");
        }

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment record not found for this order."));

        if (!payment.getStatus().equals(PaymentStatus.HELD)) {
            throw new BadRequestException("Payment is not in HELD state.");
        }

        // Release Money to Vendor
        payment.setStatus(PaymentStatus.RELEASED);
        payment = paymentRepository.save(payment);

        // Record Vendor Credit Transaction
        Transaction vendorCredit = Transaction.builder()
                .user(order.getVendor().getUser())
                .type(TransactionType.CREDIT)
                .amount(payment.getAmount())
                .referenceId(payment.getId())
                .build();
        transactionRepository.save(vendorCredit);

        // Update vendor's total earnings
        Vendor vendor = order.getVendor();
        vendor.setTotalEarnings(vendor.getTotalEarnings().add(payment.getAmount()));
        vendorRepository.save(vendor);

        // Update Order to COMPLETED
        order.setStatus(OrderStatus.COMPLETED);
        orderRepository.save(order);

        return PaymentResponse.fromEntity(payment);
    }
}
