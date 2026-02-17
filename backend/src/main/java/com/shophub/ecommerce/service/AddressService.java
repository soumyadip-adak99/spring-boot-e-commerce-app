package com.shophub.ecommerce.service;

import com.shophub.ecommerce.model.Address;

public interface AddressService {
    Address addAddress(String email, String name, String phoneNumber, String country,
                       String pinCode, String houseNo, String area, String landmark,
                       String city, String state);
}
