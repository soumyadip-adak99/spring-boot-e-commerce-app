package com.shophub.ecommerce.repository;

import com.shophub.ecommerce.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {
}
