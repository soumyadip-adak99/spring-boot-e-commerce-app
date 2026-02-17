package com.shophub.ecommerce.service;

import com.shophub.ecommerce.enums.PaymentStatus;
import com.shophub.ecommerce.model.Order;

import java.util.List;

public interface OrderService {

    Order createOrder(String email, String productId,
            PaymentStatus paymentStatus, String paymentMode,
            String addressId, int quantity,
            String razorpayOrderId, String razorpayPaymentId,
            String razorpaySignature);

    List<Order> getAllOrders();

    Order getOrderById(String id);

    Order updatePaymentStatus(String orderId, String razorpayPaymentId, String razorpaySignature);

    Order createOrderFromCart(String email,
            PaymentStatus paymentStatus, String paymentMode, String addressId,
            String razorpayOrderId, String razorpayPaymentId,
            String razorpaySignature);
}
