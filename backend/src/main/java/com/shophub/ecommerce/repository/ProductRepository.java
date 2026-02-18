package com.shophub.ecommerce.repository;

import com.shophub.ecommerce.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByProductNameContainingIgnoreCase(String productName);
}
