package com.shophub.ecommerce.service;

import com.shophub.ecommerce.dto.ProductResponse;
import com.shophub.ecommerce.enums.ProductStatus;
import com.shophub.ecommerce.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {

    List<ProductResponse> getAllProducts();

    Product getProductById(String id);

    Product addProduct(String productName, String productDescription,
                       double price, ProductStatus status, String category,
                       MultipartFile image
    ) throws IOException;

    Product updateProduct(String id, String productName, String productDescription,
                          Double price, String image, ProductStatus status, String category);

    Product deleteProduct(String id);
}
