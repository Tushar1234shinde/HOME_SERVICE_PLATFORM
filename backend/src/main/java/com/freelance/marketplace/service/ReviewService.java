package com.freelance.marketplace.service;

import com.freelance.marketplace.dto.ReviewRequest;
import com.freelance.marketplace.dto.ReviewResponse;
import com.freelance.marketplace.entity.Order;
import com.freelance.marketplace.entity.OrderStatus;
import com.freelance.marketplace.entity.Review;
import com.freelance.marketplace.entity.Vendor;
import com.freelance.marketplace.exception.BadRequestException;
import com.freelance.marketplace.exception.ResourceNotFoundException;
import com.freelance.marketplace.repository.OrderRepository;
import com.freelance.marketplace.repository.ReviewRepository;
import com.freelance.marketplace.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final VendorRepository vendorRepository;

    @Transactional
    public ReviewResponse openReview(ReviewRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getStatus().equals(OrderStatus.COMPLETED)) {
            throw new BadRequestException("Reviews can only be left for COMPLETED orders.");
        }

        // Optional: Check if review already exists for this order
        // if (reviewRepository.existsByOrderId(order.getId())) { throw... }

        Review review = Review.builder()
                .order(order)
                .client(order.getClient())
                .vendor(order.getVendor())
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        review = reviewRepository.save(review);

        recalculateVendorRating(order.getVendor());

        return ReviewResponse.fromEntity(review);
    }

    private void recalculateVendorRating(Vendor vendor) {
        List<Review> vendorReviews = reviewRepository.findByVendorId(vendor.getId());
        double average = vendorReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        
        vendor.setRating(BigDecimal.valueOf(average).setScale(2, RoundingMode.HALF_UP));
        vendorRepository.save(vendor);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getVendorReviews(java.util.UUID vendorId) {
        return reviewRepository.findByVendorId(vendorId).stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
