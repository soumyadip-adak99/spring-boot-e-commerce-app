package com.shophub.ecommerce.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RazorpayService {

    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    public Order createOrder(double amount, String currency, String receipt) throws RazorpayException {
        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (int) (amount * 100)); // Convert to paise
        orderRequest.put("currency", currency);
        orderRequest.put("receipt", receipt);
        orderRequest.put("payment_capture", 1);

        Order order = razorpayClient.orders.create(orderRequest);
        log.info("Razorpay order created: {}", (Object) order.get("id"));
        return order;
    }

    public boolean verifyPaymentSignature(String orderId, String paymentId, String signature)
            throws RazorpayException {
        JSONObject attributes = new JSONObject();
        attributes.put("razorpay_order_id", orderId);
        attributes.put("razorpay_payment_id", paymentId);
        attributes.put("razorpay_signature", signature);

        return Utils.verifyPaymentSignature(attributes, keySecret);
    }

    public String getKeyId() {
        return keyId;
    }
}
