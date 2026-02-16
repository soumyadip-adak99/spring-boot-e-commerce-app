package com.shophub.ecommerce.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ApiException extends RuntimeException {
    private final HttpStatus status;

    public ApiException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public ApiException(int statusCode, String message) {
        super(message);
        this.status = HttpStatus.valueOf(statusCode);
    }
}
