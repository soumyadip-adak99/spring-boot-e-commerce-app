package com.shophub.ecommerce.service.implementation;

import com.shophub.ecommerce.exception.ApiException;
import com.shophub.ecommerce.mapper.AddressMapper;
import com.shophub.ecommerce.model.Address;
import com.shophub.ecommerce.model.User;
import com.shophub.ecommerce.repository.AddressRepository;
import com.shophub.ecommerce.repository.UserRepository;
import com.shophub.ecommerce.service.AddressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final AddressMapper addressMapper;

    @Override
    @CacheEvict(value = "userDetails_v2", allEntries = true)
    public Address addAddress(String email, String name, String phoneNumber, String country,
                              String pinCode, String houseNo, String area, String landmark,
                              String city, String state) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (name == null || name.trim().isEmpty()) {
            name = user.getFirstName() + " " + user.getLastName();
        }

        Address address = addressMapper.toAddress(user, email, name, phoneNumber, country,
                pinCode, houseNo, area, landmark,
                city, state);

        address = addressRepository.save(address);

        user.getAddress().add(address.getId());
        userRepository.save(user);

        log.info("Address added for user: {}", email);
        return address;
    }
}
