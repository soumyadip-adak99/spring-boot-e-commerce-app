package com.shophub.ecommerce.service;

import com.shophub.ecommerce.model.Address;
import com.shophub.ecommerce.model.Order;
import com.shophub.ecommerce.model.Product;

public interface EmailService {
    void sendWelcomeEmail(String to, String name);

    void sendOrderConfirmationEmail(String to, String userName, Order order, Product product, Address address);
}
