package com.shophub.ecommerce.controller;

import com.shophub.ecommerce.dto.ApiResponse;
import com.shophub.ecommerce.model.Product;
import com.shophub.ecommerce.enums.ProductStatus;
import com.shophub.ecommerce.service.OrderService;
import com.shophub.ecommerce.service.implementation.ProductService;
import com.shophub.ecommerce.service.implementation.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final UserService userService;
    private final OrderService orderService;

    @GetMapping("/get-all-users")
    public ResponseEntity<ApiResponse> getAllUsers() {
        return ResponseEntity.ok(
                ApiResponse.success("Users fetched", userService.getAllUsers()));
    }

    @GetMapping("/get-all-products")
    public ResponseEntity<ApiResponse> getAllProducts() {
        return ResponseEntity.ok(
                ApiResponse.success("Products fetched", productService.getAllProducts()));
    }

    @PostMapping("/add-product")
    public ResponseEntity<ApiResponse> addProduct(
            @RequestParam("product_name") String productName,
            @RequestParam("product_description") String productDescription,
            @RequestParam("price") double price,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam("image") MultipartFile image) throws IOException {

        ProductStatus productStatus = status != null ? ProductStatus.valueOf(status) : ProductStatus.IN_STOCK;

        Product product = productService.addProduct(
                productName, productDescription, price, productStatus, category, image);
        return ResponseEntity.ok(ApiResponse.success("Product added successfully", product));
    }

    @PutMapping("/update-product/{id}")
    public ResponseEntity<ApiResponse> updateProduct(
            @PathVariable String id,
            @RequestParam(value = "product_name", required = false) String productName,
            @RequestParam(value = "product_description", required = false) String productDescription,
            @RequestParam(value = "price", required = false) Double price,
            @RequestParam(value = "image", required = false) String image,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "category", required = false) String category) {

        ProductStatus productStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            productStatus = ProductStatus.valueOf(status);
        }

        Product product = productService.updateProduct(
                id, productName, productDescription, price, image, productStatus, category);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", product));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteProduct(@PathVariable String id) {
        Product deleted = productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", deleted));
    }

    @PostMapping("/delete-user/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully"));
    }

    @GetMapping("/get-all-order")
    public ResponseEntity<ApiResponse> getAllOrders() {
        return ResponseEntity.ok(
                ApiResponse.success("Orders fetched", orderService.getAllOrders()));
    }
}
