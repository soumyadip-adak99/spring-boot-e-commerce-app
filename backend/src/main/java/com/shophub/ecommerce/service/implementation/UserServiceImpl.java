package com.shophub.ecommerce.service.implementation;

import com.shophub.ecommerce.exception.ApiException;
import com.shophub.ecommerce.model.*;
import com.shophub.ecommerce.repository.AddressRepository;
import com.shophub.ecommerce.repository.OrderRepository;
import com.shophub.ecommerce.repository.ProductRepository;
import com.shophub.ecommerce.repository.UserRepository;
import com.shophub.ecommerce.service.EmailService;
import com.shophub.ecommerce.service.JwtService;
import com.shophub.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final AddressRepository addressRepository;
    private final OrderRepository orderRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    @Override
    public void registerUser(String firstName, String lastName, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "User with email already exists.");
        }

        User user = User.builder()
                .firstName(firstName)
                .lastName(lastName)
                .email(email)
                .password(passwordEncoder.encode(password))
                .roles(new ArrayList<>(List.of("USER")))
                .cartItems(new ArrayList<>())
                .address(new ArrayList<>())
                .buyingProducts(new ArrayList<>())
                .orders(new ArrayList<>())
                .build();

         userRepository.save(user);

        // Send welcome email asynchronously
        emailService.sendWelcomeEmail(email, firstName + " " + lastName);
    }

    @Override
    public Map<String, Object> loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        String jwtToken = jwtService.generateToken(
                user.getId(), user.getEmail(), user.getFirstName(), user.getLastName());

        user.setJwtToken(jwtToken);
        userRepository.save(user);

        // Return user without sensitive fields
        Map<String, Object> userMap = getUserSafeMap(user);

        Map<String, Object> result = new HashMap<>();
        result.put("token", jwtToken);
        result.put("user", userMap);
        return result;
    }

    @Override
    public Map<String, Object> adminLogin(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid password");
        }

        if (!user.getRoles().contains("ADMIN")) {
            throw new ApiException(HttpStatus.FORBIDDEN, "User not a admin user");
        }

        String jwtToken = jwtService.generateToken(
                user.getId(), user.getEmail(), user.getFirstName(), user.getLastName());

        user.setJwtToken(jwtToken);
        userRepository.save(user);

        Map<String, Object> userMap = getUserSafeMap(user);

        Map<String, Object> result = new HashMap<>();
        result.put("token", jwtToken);
        result.put("user", userMap);
        return result;
    }

    @CacheEvict(value = "userDetails_v2", key = "#user.email")
    @Override
    public void logoutUser(User user) {
        user.setJwtToken(null);
        userRepository.save(user);
    }

    @Cacheable(value = "userDetails_v2", key = "#email")
    @Override
    public Map<String, Object> getUserDetails(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        Map<String, Object> userMap = getUserSafeMap(user);

        // Populate cart items with product details
        List<Map<String, Object>> cartItemsWithDetails = new ArrayList<>();
        for (CartItem cartItem : user.getCartItems()) {
            productRepository.findById(cartItem.getProductId()).ifPresent(product -> {
                Map<String, Object> itemMap = new HashMap<>();
                itemMap.put("id", product.getId());
                itemMap.put("product_name", product.getProductName());
                itemMap.put("product_description", product.getProductDescription());
                itemMap.put("price", product.getPrice());
                itemMap.put("image", product.getImage());
                itemMap.put("status", product.getStatus());
                itemMap.put("category", product.getCategory());
                itemMap.put("quantity", cartItem.getQuantity());
                cartItemsWithDetails.add(itemMap);
            });
        }
        userMap.put("cart_items", cartItemsWithDetails);

        // Populate addresses
        List<Address> addresses = user.getAddress().stream()
                .map(addressRepository::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
        userMap.put("address", addresses);

        // Populate orders with product details
        List<Map<String, Object>> orderDetails = new ArrayList<>();
        for (String orderId : user.getOrders()) {
            orderRepository.findById(orderId).ifPresent(order -> {
                Map<String, Object> orderMap = new LinkedHashMap<>();
                orderMap.put("id", order.getId());
                orderMap.put("payment_status", order.getPaymentStatus());
                orderMap.put("payment_mode", order.getPaymentMode());
                orderMap.put("quantity", order.getQuantity());
                orderMap.put("createdAt", order.getCreatedAt());

                // Resolve product details for the order (Support both single and multi-item)
                List<Map<String, Object>> itemsDetails = new ArrayList<>();
                if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
                    for (OrderItem item : order.getOrderItems()) {
                        productRepository.findById(item.getProductId()).ifPresent(product -> {
                            Map<String, Object> prodMap = new HashMap<>();
                            prodMap.put("product_id", product.getId());
                            prodMap.put("product_name", product.getProductName());
                            prodMap.put("product_description", product.getProductDescription());
                            prodMap.put("price", item.getPrice()); // Use price from order time
                            prodMap.put("current_price", product.getPrice());
                            prodMap.put("image", product.getImage());
                            prodMap.put("status", product.getStatus());
                            prodMap.put("category", product.getCategory());
                            prodMap.put("quantity", item.getQuantity());
                            itemsDetails.add(prodMap);
                        });
                    }
                } else if (order.getProduct() != null) {
                    // Fallback for legacy orders
                    productRepository.findById(order.getProduct()).ifPresent(product -> {
                        Map<String, Object> prodMap = new HashMap<>();
                        prodMap.put("product_id", product.getId());
                        prodMap.put("product_name", product.getProductName());
                        prodMap.put("product_description", product.getProductDescription());
                        prodMap.put("price", product.getPrice());
                        prodMap.put("image", product.getImage());
                        prodMap.put("status", product.getStatus());
                        prodMap.put("category", product.getCategory());
                        prodMap.put("quantity", order.getQuantity());
                        itemsDetails.add(prodMap);
                    });
                }

                // For backward compatibility for frontend that expects flat product structure
                if (!itemsDetails.isEmpty()) {
                    Map<String, Object> firstItem = itemsDetails.get(0);
                    orderMap.putAll(firstItem); // Flatten first item details into orderMap
                    orderMap.put("items", itemsDetails); // Also provide full list
                }

                // Resolve address details for the order
                if (order.getAddress() != null) {
                    addressRepository.findById(order.getAddress()).ifPresent(addr -> {
                        orderMap.put("address_name", addr.getName());
                        orderMap.put("address_city", addr.getCity());
                    });
                }

                orderDetails.add(orderMap);
            });
        }
        userMap.put("orders", orderDetails);

        return userMap;
    }

    @CacheEvict(value = "userDetails_v2", key = "#email")
    @Override
    public Map<String, Object> addToCart(String email, String productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        productRepository.findById(productId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));

        // Check if product already in cart
        boolean alreadyExists = user.getCartItems().stream()
                .anyMatch(item -> item.getProductId().equals(productId));

        if (alreadyExists) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Product already exists.");
        }

        user.getCartItems().add(new CartItem(productId));
        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Successfully add to cart");
        result.put("cart_items", user.getCartItems());
        return result;
    }

    @CacheEvict(value = "userDetails_v2", key = "#email")
    @Override
    public Map<String, Object> updateCartQuantity(String email, String productId, int quantity) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (quantity < 1) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Quantity must be at least 1");
        }

        boolean found = false;
        for (CartItem item : user.getCartItems()) {
            if (item.getProductId().equals(productId)) {
                item.setQuantity(quantity);
                found = true;
                break;
            }
        }

        if (!found) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Product not found in cart");
        }

        userRepository.save(user);

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Cart quantity updated successfully");
        result.put("cart_items", user.getCartItems());
        return result;
    }

    @Override
    @CacheEvict(value = "userDetails_v2", key = "#email")
    public void deleteCartItem(String email, String productId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        user.getCartItems().removeIf(item -> item.getProductId().equals(productId));
        userRepository.save(user);
    }

    @Override
    @CacheEvict(value = "userDetails_v2", key = "#email")
    public Map<String, Object> updateProfile(String email, String firstName, String lastName,
                                             String profileImage) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (firstName != null && !firstName.trim().isEmpty()) {
            user.setFirstName(firstName.trim());
        }
        if (lastName != null && !lastName.trim().isEmpty()) {
            user.setLastName(lastName.trim());
        }
        if (profileImage != null) {
            user.setProfileImage(profileImage);
        }

        userRepository.save(user);

        Map<String, Object> result = getUserSafeMap(user);
        return result;
    }

    @Override
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::getUserSafeMap)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        userRepository.delete(user);
    }

    private Map<String, Object> getUserSafeMap(User user) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", user.getId());
        map.put("first_name", user.getFirstName());
        map.put("last_name", user.getLastName());
        map.put("email", user.getEmail());
        map.put("profile_image", user.getProfileImage());
        map.put("roles", user.getRoles());
        map.put("cart_items", user.getCartItems());
        map.put("address", user.getAddress());
        map.put("buying_products", user.getBuyingProducts());
        map.put("orders", user.getOrders());
        map.put("createdAt", user.getCreatedAt());
        map.put("updatedAt", user.getUpdatedAt());
        return map;
    }
}
