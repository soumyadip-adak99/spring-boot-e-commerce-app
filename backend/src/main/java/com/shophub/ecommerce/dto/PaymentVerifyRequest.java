package com.shophub.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentVerifyRequest {
    private String razorpay_order_id;
    private String razorpay_payment_id;
    private String razorpay_signature;
    private String product_id;
    private String address_id;
    private int quantity;
}
