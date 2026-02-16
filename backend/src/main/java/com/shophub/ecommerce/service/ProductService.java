package com.shophub.ecommerce.service;

import com.shophub.ecommerce.dto.ProductResponse;
import com.shophub.ecommerce.exception.ApiException;
import com.shophub.ecommerce.mapper.ProductMapper;
import com.shophub.ecommerce.model.Product;
import com.shophub.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CloudinaryService cloudinaryService;
    private final ProductMapper productMapper;

    // @Cacheable(value = "allProducts_v2")
    public List<ProductResponse> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(productMapper::toProductResponse)
                .toList();
    }

    // @Cacheable(value = "products_v2", key = "#id")
    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    @CacheEvict(value = { "allProducts_v2", "products_v2" }, allEntries = true)
    public Product addProduct(String productName, String productDescription, double price,
            String status, String category, MultipartFile image) throws IOException {
        String imageUrl = cloudinaryService.uploadImage(image, "products");

        Product product = Product.builder()
                .productName(productName)
                .productDescription(productDescription)
                .price(price)
                .status(status != null ? status : "IN_STOCK")
                .category(category)
                .image(imageUrl)
                .build();

        return productRepository.save(product);
    }

    @CacheEvict(value = { "allProducts_v2", "products_v2" }, allEntries = true)
    public Product updateProduct(String id, String productName, String productDescription,
            Double price, String image, String status, String category) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));

        if (productName != null && !productName.trim().isEmpty()) {
            product.setProductName(productName);
        }
        if (productDescription != null && !productDescription.trim().isEmpty()) {
            product.setProductDescription(productDescription);
        }
        if (price != null) {
            product.setPrice(price);
        }
        if (image != null && !image.trim().isEmpty()) {
            product.setImage(image);
        }
        if (status != null && !status.trim().isEmpty()) {
            product.setStatus(status);
        }
        if (category != null && !category.trim().isEmpty()) {
            product.setCategory(category);
        }

        return productRepository.save(product);
    }

    @CacheEvict(value = { "allProducts_v2", "products_v2" }, allEntries = true)
    public Product deleteProduct(String id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));
        productRepository.delete(product);
        return product;
    }
}
