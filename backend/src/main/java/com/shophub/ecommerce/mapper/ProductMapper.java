package com.shophub.ecommerce.mapper;

import com.shophub.ecommerce.dto.ProductResponse;
import com.shophub.ecommerce.model.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {
    public ProductResponse toProductResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .productName(product.getProductName())
                .productDescription(product.getProductDescription())
                .status(product.getStatus())
                .image(product.getImage())
                .price(product.getPrice())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getCreatedAt())
                .build();
    }
}
