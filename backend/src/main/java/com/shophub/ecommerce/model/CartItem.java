package com.shophub.ecommerce.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    private String productId;
    private int quantity = 1;

    public CartItem(String productId) {
        this.productId = productId;
        this.quantity = 1;
    }
}
