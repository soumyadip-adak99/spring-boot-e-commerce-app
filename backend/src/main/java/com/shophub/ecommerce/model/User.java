package com.shophub.ecommerce.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User implements Serializable {

    @Id
    private String id;

    @Field("first_name")
    private String firstName;

    @Field("last_name")
    private String lastName;

    @Indexed(unique = true)
    private String email;

    @Field("profile_image")
    @Builder.Default
    private String profileImage = "";

    @Builder.Default
    private List<String> roles = new ArrayList<>(List.of("USER"));

    private String password;

    @Field("jwtToken")
    private String jwtToken;

    @Field("cart_items")
    @Builder.Default
    private List<CartItem> cartItems = new ArrayList<>();

    @Builder.Default
    private List<String> address = new ArrayList<>();

    @Field("buying_products")
    @Builder.Default
    private List<String> buyingProducts = new ArrayList<>();

    @Builder.Default
    private List<String> orders = new ArrayList<>();

    @Field("password_reset_otp")
    private String passwordResetOtp;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
