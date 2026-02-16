package com.shophub.ecommerce.service;

import com.shophub.ecommerce.exception.ApiException;
import com.shophub.ecommerce.model.*;
import com.shophub.ecommerce.repository.AddressRepository;
import com.shophub.ecommerce.repository.OrderRepository;
import com.shophub.ecommerce.repository.ProductRepository;
import com.shophub.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

        private final OrderRepository orderRepository;
        private final UserRepository userRepository;
        private final ProductRepository productRepository;
        private final AddressRepository addressRepository;
        private final EmailService emailService;

        @CacheEvict(value = "userDetails_v2", allEntries = true)
        public com.shophub.ecommerce.model.Order createOrder(String email, String productId,
                        String paymentStatus, String paymentMode,
                        String addressId, int quantity,
                        String razorpayOrderId, String razorpayPaymentId,
                        String razorpaySignature) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Product not found"));

                Address address = addressRepository.findById(addressId)
                                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Address not found"));

                if ("COD".equals(paymentMode)) {
                        paymentStatus = "PENDING";
                }

                String userName = address.getName() != null && !address.getName().isEmpty()
                                ? address.getName()
                                : user.getFirstName() + " " + user.getLastName();
                String userPhoneNumber = address.getPhoneNumber();
                String shippingAddressStr = String.format("%s, %s, %s, %s, %s, %s - %s",
                                address.getHouseNo(), address.getArea(), address.getLandmark(),
                                address.getCity(), address.getState(), address.getCountry(), address.getPinCode());

                // For single product, total amount is price * quantity
                Double totalAmount = product.getPrice() * (quantity > 0 ? quantity : 1);

                com.shophub.ecommerce.model.Order order = com.shophub.ecommerce.model.Order.builder()
                                .paymentMode(paymentMode)
                                .paymentStatus(paymentStatus)
                                .userId(user.getId())
                                .userName(userName)
                                .userEmail(user.getEmail())
                                .userPhoneNumber(userPhoneNumber)
                                .shippingAddress(shippingAddressStr)
                                .totalAmount(totalAmount)
                                .address(address.getId())
                                .product(product.getId())
                                .quantity(quantity > 0 ? quantity : 1)
                                .razorpayOrderId(razorpayOrderId)
                                .razorpayPaymentId(razorpayPaymentId)
                                .razorpaySignature(razorpaySignature)
                                .build();

                order = orderRepository.save(order);

                // Add order ID to user's orders list
                user.getOrders().add(order.getId());

                // Add product to user's buying_products
                if (!user.getBuyingProducts().contains(product.getId())) {
                        user.getBuyingProducts().add(product.getId());
                }

                // Remove from cart if present
                user.getCartItems().removeIf(item -> item.getProductId().equals(productId));

                userRepository.save(user);

                // Send order confirmation email
                String emailUserName = user.getFirstName() + " " + user.getLastName();
                emailService.sendOrderConfirmationEmail(user.getEmail(), emailUserName, order, product, address);

                log.info("Order created: {} for user: {}", order.getId(), email);
                return order;
        }

        public List<com.shophub.ecommerce.model.Order> getAllOrders() {
                return orderRepository.findAll();
        }

        public com.shophub.ecommerce.model.Order getOrderById(String id) {
                return orderRepository.findById(id)
                                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
        }

        public com.shophub.ecommerce.model.Order updatePaymentStatus(String orderId,
                        String razorpayPaymentId,
                        String razorpaySignature) {
                com.shophub.ecommerce.model.Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));

                order.setPaymentStatus("PAID");
                order.setRazorpayPaymentId(razorpayPaymentId);
                order.setRazorpaySignature(razorpaySignature);

                return orderRepository.save(order);
        }

        @CacheEvict(value = "userDetails_v2", allEntries = true)
        public com.shophub.ecommerce.model.Order createOrderFromCart(String email,
                        String paymentStatus, String paymentMode, String addressId,
                        String razorpayOrderId, String razorpayPaymentId,
                        String razorpaySignature) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

                if (user.getCartItems() == null || user.getCartItems().isEmpty()) {
                        throw new ApiException(HttpStatus.BAD_REQUEST, "Cart is empty.");
                }

                Address address = addressRepository.findById(addressId)
                                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Address not found"));

                if ("COD".equals(paymentMode)) {
                        paymentStatus = "PENDING";
                }

                List<OrderItem> orderItems = new ArrayList<>();
                for (CartItem cartItem : user.getCartItems()) {
                        Product product = productRepository.findById(cartItem.getProductId())
                                        .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,
                                                        "Product not found: " + cartItem.getProductId()));

                        orderItems.add(OrderItem.builder()
                                        .productId(product.getId())
                                        .quantity(cartItem.getQuantity())
                                        .price(product.getPrice())
                                        .build());
                }

                // Calculate total amount
                Double totalAmount = orderItems.stream()
                                .mapToDouble(item -> item.getPrice()
                                                * (item.getQuantity() > 0 ? item.getQuantity() : 1))
                                .sum();

                String userName = address.getName() != null && !address.getName().isEmpty()
                                ? address.getName()
                                : user.getFirstName() + " " + user.getLastName();
                String userPhoneNumber = address.getPhoneNumber();
                String shippingAddressStr = String.format("%s, %s, %s, %s, %s, %s - %s",
                                address.getHouseNo(), address.getArea(), address.getLandmark(),
                                address.getCity(), address.getState(), address.getCountry(), address.getPinCode());

                com.shophub.ecommerce.model.Order order = com.shophub.ecommerce.model.Order.builder()
                                .paymentMode(paymentMode)
                                .paymentStatus(paymentStatus)
                                .userId(user.getId())
                                .userName(userName)
                                .userEmail(user.getEmail())
                                .userPhoneNumber(userPhoneNumber)
                                .shippingAddress(shippingAddressStr)
                                .totalAmount(totalAmount)
                                .address(address.getId())
                                .orderItems(orderItems)
                                // Deprecated fields for backward compatibility (setting first item or generic)
                                .product(orderItems.get(0).getProductId())
                                .quantity(orderItems.get(0).getQuantity())
                                .razorpayOrderId(razorpayOrderId)
                                .razorpayPaymentId(razorpayPaymentId)
                                .razorpaySignature(razorpaySignature)
                                .build();

                order = orderRepository.save(order);

                // Add order ID to user's orders list
                user.getOrders().add(order.getId());

                // Add products to user's buying_products
                for (OrderItem item : orderItems) {
                        if (!user.getBuyingProducts().contains(item.getProductId())) {
                                user.getBuyingProducts().add(item.getProductId());
                        }
                }

                // Clear cart
                user.getCartItems().clear();

                userRepository.save(user);

                // Send order confirmation email (updated to handle multiple items)
                String emailUserName = user.getFirstName() + " " + user.getLastName();
                // Note: Email service might need update to handle lists, for now sending
                // generic or
                // loop?
                // For now, we will just trigger the existing email service for the first item
                // as a
                // fallback
                if (!orderItems.isEmpty()) {
                        Product firstProduct = productRepository.findById(orderItems.get(0).getProductId())
                                        .orElse(null);
                        if (firstProduct != null) {
                                emailService.sendOrderConfirmationEmail(user.getEmail(), emailUserName, order,
                                                firstProduct,
                                                address);
                        }
                }

                log.info("Cart Order created: {} for user: {}", order.getId(), email);
                return order;
        }
}
