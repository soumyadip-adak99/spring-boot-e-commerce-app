package com.shophub.ecommerce.mapper;

import com.shophub.ecommerce.model.*;
import com.shophub.ecommerce.enums.PaymentStatus;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper {

    public Order toOrder(User user, Address address, Product product,
            PaymentStatus paymentStatus, String paymentMode,
            int quantity,
            String razorpayOrderId, String razorpayPaymentId,
            String razorpaySignature, String userName, String userPhoneNumber, Double totalAmount,
            String shippingAddressStr) {

        return Order.builder()
                .paymentMode(paymentMode)
                .paymentStatus(paymentStatus)
                .userId(user.getId())
                .userName(userName)
                .userEmail(user.getEmail())
                .userPhoneNumber(userPhoneNumber)
                .shippingAddress(shippingAddressStr)
                .totalAmount(totalAmount)
                .address(address.getId())
                .product(product.getId())
                .quantity(quantity > 0 ? quantity : 1)
                .razorpayOrderId(razorpayOrderId)
                .razorpayPaymentId(razorpayPaymentId)
                .razorpaySignature(razorpaySignature).build();
    }

    public Order toOrder(String paymentMode, PaymentStatus paymentStatus, User user,
            String userName, String userPhoneNumber,
            String shippingAddressStr, Double totalAmount,
            Address address, List<OrderItem> orderItems, String productId,
            int orderQuantity, String razorpayOrderId, String razorpayPaymentId,
            String razorpaySignature) {
        return Order.builder()
                .paymentMode(paymentMode)
                .paymentStatus(paymentStatus)
                .userId(user.getId())
                .userName(userName)
                .userEmail(user.getEmail())
                .userPhoneNumber(userPhoneNumber)
                .shippingAddress(shippingAddressStr)
                .totalAmount(totalAmount)
                .address(address.getId())
                .orderItems(orderItems)
                .product(productId)
                .quantity(orderQuantity)
                .razorpayOrderId(razorpayOrderId)
                .razorpayPaymentId(razorpayPaymentId)
                .razorpaySignature(razorpaySignature)
                .build();
    }
}
