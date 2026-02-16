package com.shophub.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    private String payment_status;
    private String payment_mode;
    private String address;
    private String payment_id;
    @Builder.Default
    private int quantity = 1;
}
