package com.shophub.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    @JsonProperty("id")
    private String id;

    @JsonProperty("product_name")
    private String productName;

    @JsonProperty("product_description")
    private String productDescription;

    @JsonProperty("price")
    private double price;

    @JsonProperty("image")
    private String image;

    @JsonProperty("status")
    private String status = "IN_STOCK";

    @JsonProperty("category")
    private String category;

    @JsonProperty("create_at")
    private Instant createdAt;

    @JsonProperty("update_at")
    private Instant updatedAt;

}
