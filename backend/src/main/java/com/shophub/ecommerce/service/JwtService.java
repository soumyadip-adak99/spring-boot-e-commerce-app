package com.shophub.ecommerce.service;

import io.jsonwebtoken.Claims;

import java.util.function.Function;

public interface JwtService {

    String generateToken(String userId, String email, String firstName, String lastName);

    String extractEmail(String token);

    String extractUserId(String token);

    boolean isTokenValid(String token);

    <T> T extractClaim(String token, Function<Claims, T> claimsResolver);
}
