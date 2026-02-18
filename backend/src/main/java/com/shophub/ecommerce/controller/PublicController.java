package com.shophub.ecommerce.controller;

import com.shophub.ecommerce.dto.ApiResponse;
import com.shophub.ecommerce.dto.LoginRequest;
import com.shophub.ecommerce.dto.RegisterRequest;
import com.shophub.ecommerce.service.ProductService;
import com.shophub.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicController {

        private final UserService userService;
        private final ProductService productService;

        @PostMapping("/register")
        public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {
                userService.registerUser(
                                request.getFirst_name(),
                                request.getLast_name(),
                                request.getEmail(),
                                request.getPassword());
                return ResponseEntity.ok(ApiResponse.success("User registered successfully"));
        }

        @PostMapping("/login")
        public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest request) {
                Map<String, Object> loginResult = userService.loginUser(request.getEmail(), request.getPassword());

                String token = (String) loginResult.get("token");

                ResponseCookie cookie = ResponseCookie.from("jwtToken", token)
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(Duration.ofDays(7))
                                .sameSite("Lax")
                                .build();

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                                .body(ApiResponse.success("Login successfully", loginResult));
        }

        @PostMapping("/admin-login")
        public ResponseEntity<ApiResponse> adminLogin(@RequestBody LoginRequest request) {
                Map<String, Object> loginResult = userService.adminLogin(request.getEmail(), request.getPassword());

                String token = (String) loginResult.get("token");

                ResponseCookie cookie = ResponseCookie.from("jwtToken", token)
                                .httpOnly(true)
                                .secure(false)
                                .path("/")
                                .maxAge(Duration.ofDays(7))
                                .sameSite("Lax")
                                .build();

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                                .body(ApiResponse.success("Admin login successfully", loginResult));
        }

        @GetMapping("/get-all-products")
        public ResponseEntity<ApiResponse> getAllProducts() {
                return ResponseEntity.ok(
                                ApiResponse.success("Products fetched successfully", productService.getAllProducts()));
        }

        @GetMapping("/search")
        public ResponseEntity<ApiResponse> searchProducts(@RequestParam String keyword) {
                return ResponseEntity.ok(ApiResponse.success("Search results fetched successfully",
                                productService.searchProducts(keyword)));
        }
}
