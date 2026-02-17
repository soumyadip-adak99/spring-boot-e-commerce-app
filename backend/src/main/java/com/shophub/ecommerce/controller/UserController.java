package com.shophub.ecommerce.controller;

import com.shophub.ecommerce.dto.*;
import com.shophub.ecommerce.model.Address;
import com.shophub.ecommerce.model.Order;
import com.shophub.ecommerce.model.User;
import com.shophub.ecommerce.enums.PaymentStatus;
import com.shophub.ecommerce.service.AddressService;
import com.shophub.ecommerce.service.CloudinaryService;
import com.shophub.ecommerce.service.OrderService;
import com.shophub.ecommerce.service.implementation.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final OrderService orderService;
    private final AddressService addressService;
    private final CloudinaryService cloudinaryService;

    @GetMapping("/user-details")
    public ResponseEntity<ApiResponse> getUserDetails(@AuthenticationPrincipal User user) {
        Map<String, Object> details = userService.getUserDetails(user.getEmail());
        return ResponseEntity.ok(ApiResponse.success("User details fetched", details));
    }

    @PostMapping("/add-to-cart/{id}")
    public ResponseEntity<ApiResponse> addToCart(@AuthenticationPrincipal User user,
            @PathVariable String id) {
        Map<String, Object> result = userService.addToCart(user.getEmail(), id);
        return ResponseEntity.ok(ApiResponse.success("Successfully add to cart", result));
    }

    @PutMapping("/update-cart/{id}")
    public ResponseEntity<ApiResponse> updateCartQuantity(@AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody CartUpdateRequest request) {
        Map<String, Object> result = userService.updateCartQuantity(
                user.getEmail(), id, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("Cart quantity updated", result));
    }

    @PostMapping("/delete-cart/{id}")
    public ResponseEntity<ApiResponse> deleteCartItem(@AuthenticationPrincipal User user,
            @PathVariable String id) {
        userService.deleteCartItem(user.getEmail(), id);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart"));
    }

    @PostMapping("/create-order/{id}")
    public ResponseEntity<ApiResponse> createOrder(@AuthenticationPrincipal User user,
            @PathVariable String id,
            @RequestBody OrderRequest request) {
        Order order = orderService.createOrder(
                user.getEmail(),
                id,
                request.getPayment_status(),
                request.getPayment_mode(),
                request.getAddress(),
                request.getQuantity(),
                null, null, null);
        return ResponseEntity.ok(ApiResponse.success("Order created successfully", order));
    }

    @PostMapping("/create-order/cart")
    public ResponseEntity<ApiResponse> createOrderFromCart(@AuthenticationPrincipal User user,
            @RequestBody OrderRequest request) {
        Order order = orderService.createOrderFromCart(
                user.getEmail(),
                request.getPayment_status(),
                request.getPayment_mode(),
                request.getAddress(),
                null, null, null);
        return ResponseEntity.ok(ApiResponse.success("Order created from cart successfully", order));
    }

    @PostMapping("/add-address")
    public ResponseEntity<ApiResponse> addAddress(@AuthenticationPrincipal User user,
            @RequestBody AddressRequest request) {
        Address address = addressService.addAddress(
                user.getEmail(),
                request.getName(),
                request.getPhone_number(),
                request.getCountry(),
                request.getPin_code(),
                request.getHouse_no(),
                request.getArea(),
                request.getLandmark(),
                request.getCity(),
                request.getState());
        return ResponseEntity.ok(ApiResponse.success("Address added successfully", address));
    }

    @PutMapping("/update-profile")
    public ResponseEntity<ApiResponse> updateProfile(@AuthenticationPrincipal User user,
            @RequestBody ProfileUpdateRequest request) {
        Map<String, Object> updated = userService.updateProfile(
                user.getEmail(),
                request.getFirst_name(),
                request.getLast_name(),
                request.getProfile_image());
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PostMapping("/upload-profile-image")
    public ResponseEntity<ApiResponse> uploadProfileImage(@AuthenticationPrincipal User user,
            @RequestParam("image") MultipartFile image) throws IOException {
        String imageUrl = cloudinaryService.uploadImage(image, "profiles");
        Map<String, Object> updated = userService.updateProfile(
                user.getEmail(), null, null, imageUrl);
        return ResponseEntity.ok(ApiResponse.success("Profile image uploaded", updated));
    }
}
