package com.freelance.marketplace.controller;

import com.freelance.marketplace.dto.ApiResponse;
import com.freelance.marketplace.dto.GigRequest;
import com.freelance.marketplace.dto.GigResponse;
import com.freelance.marketplace.service.GigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/gigs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class GigController {

    private final GigService gigService;

    @PostMapping
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<ApiResponse<GigResponse>> createGig(@Valid @RequestBody GigRequest gigRequest) {
        GigResponse response = gigService.createGig(gigRequest);
        return new ResponseEntity<>(ApiResponse.success(response, "Gig created successfully"), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GigResponse>>> getAllGigs(
            @RequestParam(required = false) String category) {
        List<GigResponse> gigs;
        if (category != null && !category.isEmpty()) {
            gigs = gigService.getGigsByCategory(category);
        } else {
            gigs = gigService.getAllGigs();
        }
        return ResponseEntity.ok(ApiResponse.success(gigs, "Gigs fetched successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GigResponse>> getGigById(@PathVariable UUID id) {
        GigResponse gig = gigService.getGigById(id);
        return ResponseEntity.ok(ApiResponse.success(gig, "Gig fetched successfully"));
    }
}
