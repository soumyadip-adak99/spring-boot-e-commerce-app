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

                com.shophub.ecommerce.model.Order order = com.shophub.ecommerce.model.Order.builder()
                                .paymentMode(paymentMode)
                                .paymentStatus(paymentStatus)
                                .userId(user.getId())
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
                String userName = user.getFirstName() + " " + user.getLastName();
                emailService.sendOrderConfirmationEmail(user.getEmail(), userName, order, product, address);

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
}
