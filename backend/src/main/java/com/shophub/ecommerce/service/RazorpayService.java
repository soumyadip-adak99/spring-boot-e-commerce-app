package com.shophub.ecommerce.service;

import com.razorpay.Order;
import com.razorpay.RazorpayException;

public interface RazorpayService {

    Order createOrder(double amount, String currency, String receipt) throws RazorpayException;

    boolean verifyPaymentSignature(String orderId, String paymentId, String signature) throws RazorpayException;

    String getKeyId();
}
