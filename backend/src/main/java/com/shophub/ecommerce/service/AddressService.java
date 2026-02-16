package com.shophub.ecommerce.service;

import com.shophub.ecommerce.exception.ApiException;
import com.shophub.ecommerce.model.Address;
import com.shophub.ecommerce.model.User;
import com.shophub.ecommerce.repository.AddressRepository;
import com.shophub.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @CacheEvict(value = "userDetails_v2", allEntries = true)
    public Address addAddress(String email, String name, String phoneNumber, String country,
            String pinCode, String houseNo, String area, String landmark,
            String city, String state) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (name == null || name.trim().isEmpty()) {
            name = user.getFirstName() + " " + user.getLastName();
        }

        Address address = Address.builder()
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

        address = addressRepository.save(address);

        user.getAddress().add(address.getId());
        userRepository.save(user);

        log.info("Address added for user: {}", email);
        return address;
    }
}
