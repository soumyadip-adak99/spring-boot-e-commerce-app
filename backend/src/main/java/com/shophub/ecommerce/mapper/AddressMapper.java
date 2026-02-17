package com.shophub.ecommerce.mapper;

import com.shophub.ecommerce.model.Address;
import com.shophub.ecommerce.model.User;
import org.springframework.stereotype.Component;

@Component
public class AddressMapper {
    public Address toAddress(User user, String email, String name, String phoneNumber, String country,
                             String pinCode, String houseNo, String area, String landmark,
                             String city, String state) {

        return Address.builder()
                .user(user.getId())
                .name(name)
                .phoneNumber(phoneNumber)
                .country(country != null ? country : "India")
                .pinCode(pinCode)
                .houseNo(houseNo)
                .area(area)
                .landmark(landmark != null ? landmark : "")
                .city(city)
                .state(state)
                .build();
    }
}
