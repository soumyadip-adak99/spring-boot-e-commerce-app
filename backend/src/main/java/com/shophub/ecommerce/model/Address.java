package com.shophub.ecommerce.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.io.Serializable;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "addresses")
public class Address implements Serializable {

    @Id
    private String id;

    private String user;

    private String name;

    @Field("phone_number")
    private String phoneNumber;

    @Builder.Default
    private String country = "India";

    @Field("pin_code")
    private String pinCode;

    @Field("house_no")
    private String houseNo;

    private String area;

    @Builder.Default
    private String landmark = "";

    private String city;

    private String state;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
