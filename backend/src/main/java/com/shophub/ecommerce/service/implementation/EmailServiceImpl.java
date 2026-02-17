package com.shophub.ecommerce.service.implementation;

import com.shophub.ecommerce.model.Order;
import com.shophub.ecommerce.model.Product;
import com.shophub.ecommerce.model.Address;
import com.shophub.ecommerce.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    @Async
    public void sendWelcomeEmail(String to, String name) {
        try {
            Context context = new Context();
            context.setVariable("name", name.toUpperCase());

            String htmlBody = templateEngine.process("welcome-email", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Welcome to ShopHub " + name.toUpperCase());
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("Welcome email sent to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send welcome email to: {}", to, e);
        }
    }

    @Override
    @Async
    public void sendOrderConfirmationEmail(String to, String userName, Order order,
                                           Product product, Address address) {
        try {
            Context context = new Context();
            context.setVariable("userName", userName);
            context.setVariable("orderId", order.getId());
            context.setVariable("productName", product.getProductName());
            context.setVariable("productImage", product.getImage());
            context.setVariable("productPrice", product.getPrice());
            context.setVariable("quantity", String.valueOf(order.getQuantity()));
            context.setVariable("totalAmount", product.getPrice() * order.getQuantity());
            context.setVariable("paymentMode", order.getPaymentMode());
            context.setVariable("paymentStatus", order.getPaymentStatus());
            context.setVariable("addressName", address.getName());
            context.setVariable("addressLine", address.getHouseNo() + ", " + address.getArea());
            context.setVariable("addressCity", address.getCity() + ", " + address.getState() + " - " + address.getPinCode());
            context.setVariable("phone", address.getPhoneNumber());

            String htmlBody = templateEngine.process("order-confirmation-email", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Order Confirmed! #" + order.getId() + " - ShopHub");
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("Order confirmation email sent to: {} for order: {}", to, order.getId());
        } catch (MessagingException e) {
            log.error("Failed to send order confirmation email for order: {}", order.getId(), e);
        }
    }
}
