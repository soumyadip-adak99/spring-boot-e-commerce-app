package com.shophub.ecommerce.controller;

import com.shophub.ecommerce.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health-check")
public class HealthCheckController {

    @GetMapping
    public ResponseEntity<ApiResponse> healthCheck() {
        return ResponseEntity.ok(ApiResponse.success("Server is running", Map.of(
                "status", "UP",
                "timestamp", Instant.now().toString())));
    }
}
