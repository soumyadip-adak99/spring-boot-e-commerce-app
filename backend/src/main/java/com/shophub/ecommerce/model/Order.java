package com.shophub.ecommerce.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order implements Serializable {

    @Id
    private String id;

    @Field("payment_status")
    private String paymentStatus;

    @Field("payment_mode")
    private String paymentMode;

    @Field("userId")
    private String userId;

    private String address;

    private String product;

    @Builder.Default
    private int quantity = 1;

    @Field("razorpay_order_id")
    private String razorpayOrderId;

    @Field("razorpay_payment_id")
    private String razorpayPaymentId;

    @Field("razorpay_signature")
    private String razorpaySignature;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
