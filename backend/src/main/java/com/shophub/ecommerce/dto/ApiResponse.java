package com.shophub.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse {
    private int status;
    private String message;
    private String error_message;
    private Object data;

    public static ApiResponse success(String message) {
        return ApiResponse.builder().status(200).message(message).build();
    }

    public static ApiResponse success(String message, Object data) {
        return ApiResponse.builder().status(200).message(message).data(data).build();
    }

    public static ApiResponse error(String errorMessage) {
        return ApiResponse.builder().status(400).error_message(errorMessage).build();
    }

    public static ApiResponse error(int status, String errorMessage) {
        return ApiResponse.builder().status(status).error_message(errorMessage).build();
    }
}
