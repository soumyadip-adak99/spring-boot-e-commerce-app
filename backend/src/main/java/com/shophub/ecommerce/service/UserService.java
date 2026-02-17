package com.shophub.ecommerce.service;

import com.shophub.ecommerce.model.User;

import java.util.List;
import java.util.Map;

public interface UserService {

    void registerUser(String firstName, String lastName, String email, String password);

    Map<String, Object> loginUser(String email, String password);

    Map<String, Object> adminLogin(String email, String password);

    void logoutUser(User user);

    Map<String, Object> getUserDetails(String email);

    Map<String, Object> addToCart(String email, String productId);

    Map<String, Object> updateCartQuantity(String email, String productId, int quantity);

    void deleteCartItem(String email, String productId);

    Map<String, Object> updateProfile(String email, String firstName, String lastName, String profileImage);

    List<Map<String, Object>> getAllUsers();

    void deleteUser(String id);
}

