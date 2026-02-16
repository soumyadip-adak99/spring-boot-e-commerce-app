package com.shophub.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest {
    private String name;
    private String phone_number;
    private String country;
    private String pin_code;
    private String house_no;
    private String area;
    private String landmark;
    private String city;
    private String state;
}
