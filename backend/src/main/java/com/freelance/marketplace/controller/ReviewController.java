package com.freelance.marketplace.controller;

import com.freelance.marketplace.dto.ApiResponse;
import com.freelance.marketplace.dto.ReviewRequest;
import com.freelance.marketplace.dto.ReviewResponse;
import com.freelance.marketplace.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(@Valid @RequestBody ReviewRequest request) {
        ReviewResponse response = reviewService.openReview(request);
        return new ResponseEntity<>(ApiResponse.success(response, "Review submitted successfully!"), HttpStatus.CREATED);
    }

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getVendorReviews(@PathVariable UUID vendorId) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getVendorReviews(vendorId), "Reviews fetched successfully"));
    }
}
