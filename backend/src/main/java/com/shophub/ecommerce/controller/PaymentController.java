package com.shophub.ecommerce.controller;

import com.shophub.ecommerce.dto.ApiResponse;
import com.shophub.ecommerce.dto.PaymentVerifyRequest;
import com.shophub.ecommerce.model.User;
import com.shophub.ecommerce.exception.ApiException;
import com.shophub.ecommerce.service.OrderService;
import com.shophub.ecommerce.service.ProductService;
import com.shophub.ecommerce.service.RazorpayService;
import com.shophub.ecommerce.enums.PaymentStatus;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final RazorpayService razorpayService;
    private final ProductService productService;
    private final OrderService orderService;

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse> createRazorpayOrder(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> request) {

        String productId = (String) request.get("product_id");
        int quantity = 1;
        if (request.get("quantity") != null) {
            quantity = ((Number) request.get("quantity")).intValue();
        }

        var product = productService.getProductById(productId);
        double totalAmount = product.getPrice() * quantity;

        try {
            Order razorpayOrder = razorpayService.createOrder(
                    totalAmount, "INR", "receipt_" + System.currentTimeMillis());

            Map<String, Object> response = new HashMap<>();
            response.put("order_id", razorpayOrder.get("id"));
            response.put("amount", razorpayOrder.get("amount"));
            response.put("currency", razorpayOrder.get("currency"));
            response.put("key", razorpayService.getKeyId());

            return ResponseEntity.ok(ApiResponse.success("Razorpay order created", response));
        } catch (RazorpayException e) {
            log.error("Razorpay order creation failed", e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Payment gateway error: " + e.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verifyPayment(
            @AuthenticationPrincipal User user,
            @RequestBody PaymentVerifyRequest request) {

        try {
            boolean isValid = razorpayService.verifyPaymentSignature(
                    request.getRazorpay_order_id(),
                    request.getRazorpay_payment_id(),
                    request.getRazorpay_signature());

            if (!isValid) {
                throw new ApiException(HttpStatus.BAD_REQUEST, "Payment verification failed");
            }

            // Create order with verified payment
            var order = orderService.createOrder(
                    user.getEmail(),
                    request.getProduct_id(),
                    PaymentStatus.SUCCESS,
                    "ONLINE",
                    request.getAddress_id(),
                    request.getQuantity() > 0 ? request.getQuantity() : 1,
                    request.getRazorpay_order_id(),
                    request.getRazorpay_payment_id(),
                    request.getRazorpay_signature());

            return ResponseEntity.ok(ApiResponse.success("Payment verified and order created", order));
        } catch (RazorpayException e) {
            log.error("Payment verification failed", e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Payment verification error");
        }
    }
}
