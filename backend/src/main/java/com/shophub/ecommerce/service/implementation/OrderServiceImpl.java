package com.shophub.ecommerce.service.implementation;

import com.shophub.ecommerce.exception.ApiException;
import com.shophub.ecommerce.mapper.OrderMapper;
import com.shophub.ecommerce.model.*;
import com.shophub.ecommerce.enums.PaymentStatus;
import com.shophub.ecommerce.repository.AddressRepository;
import com.shophub.ecommerce.repository.OrderRepository;
import com.shophub.ecommerce.repository.ProductRepository;
import com.shophub.ecommerce.repository.UserRepository;
import com.shophub.ecommerce.service.EmailService;
import com.shophub.ecommerce.service.OrderService;
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
public class OrderServiceImpl implements OrderService {

        private final OrderRepository orderRepository;
        private final UserRepository userRepository;
        private final ProductRepository productRepository;
        private final AddressRepository addressRepository;
        private final EmailService emailService;
        private final OrderMapper orderMapper;

        @CacheEvict(value = "userDetails_v2", allEntries = true)
        public Order createOrder(String email, String productId,
                        PaymentStatus paymentStatus, String paymentMode,
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
                        paymentStatus = PaymentStatus.PENDING;
                }

                String userName = getUserName(user, address);
                String userPhoneNumber = address.getPhoneNumber();
                String shippingAddressStr = String.format("%s, %s, %s, %s, %s, %s - %s",
                                address.getHouseNo(), address.getArea(), address.getLandmark(),
                                address.getCity(), address.getState(), address.getCountry(), address.getPinCode());

                // For single product, total amount is price * quantity
                Double totalAmount = product.getPrice() * (quantity > 0 ? quantity : 1);

                Order order = orderMapper.toOrder(user, address, product,
                                paymentStatus, paymentMode, quantity,
                                razorpayOrderId, razorpayPaymentId,
                                razorpaySignature, userName, userPhoneNumber, totalAmount,
                                shippingAddressStr);

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

        public List<Order> getAllOrders() {
                return orderRepository.findAll();
        }

        public Order getOrderById(String id) {
                return orderRepository.findById(id)
                                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));
        }

        public Order updatePaymentStatus(String orderId,
                        String razorpayPaymentId,
                        String razorpaySignature) {
                Order order = orderRepository.findById(orderId)
                                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Order not found"));

                order.setPaymentStatus(PaymentStatus.SUCCESS);
                order.setRazorpayPaymentId(razorpayPaymentId);
                order.setRazorpaySignature(razorpaySignature);

                return orderRepository.save(order);
        }

        @CacheEvict(value = "userDetails_v2", allEntries = true)
        public Order createOrderFromCart(String email,
                        PaymentStatus paymentStatus, String paymentMode, String addressId,
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
                        paymentStatus = PaymentStatus.PENDING;
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

                String userName = getUserName(user, address);
                String userPhoneNumber = address.getPhoneNumber();
                String shippingAddressStr = String.format("%s, %s, %s, %s, %s, %s - %s",
                                address.getHouseNo(), address.getArea(), address.getLandmark(),
                                address.getCity(), address.getState(), address.getCountry(), address.getPinCode());

                Order order = orderMapper.toOrder(paymentMode, paymentStatus, user, userName,
                                userPhoneNumber, shippingAddressStr, totalAmount, address, orderItems,
                                orderItems.getFirst().getProductId(), orderItems.getFirst().getQuantity(),
                                razorpayOrderId, razorpayPaymentId, razorpaySignature);

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

        private String getUserName(User user, Address address) {
                return address.getName() != null && !address.getName().isEmpty()
                                ? address.getName()
                                : user.getFirstName() + " " + user.getLastName();
        }
}
