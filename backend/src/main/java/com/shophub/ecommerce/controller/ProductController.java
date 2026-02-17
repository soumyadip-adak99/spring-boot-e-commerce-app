package com.shophub.ecommerce.controller;

import com.shophub.ecommerce.dto.ApiResponse;
import com.shophub.ecommerce.model.Product;
import com.shophub.ecommerce.service.implementation.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/get-by-id/{id}")
    public ResponseEntity<ApiResponse> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product fetched", product));
    }
}
