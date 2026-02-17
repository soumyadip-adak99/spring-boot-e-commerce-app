package com.shophub.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.shophub.ecommerce.enums.PaymentStatus;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private PaymentStatus payment_status;
    private String payment_mode;
    private String address;
    private String payment_id;
    @Builder.Default
    private int quantity = 1;
}
