package com.freelance.marketplace.controller;

import com.freelance.marketplace.dto.ApiResponse;
import com.freelance.marketplace.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class FileUploadController {

    private final FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileDownloadUri = fileStorageService.storeFile(file);
        
        Map<String, String> response = Collections.singletonMap("url", fileDownloadUri);
        return ResponseEntity.ok(ApiResponse.success(response, "File uploaded successfully"));
    }
}
