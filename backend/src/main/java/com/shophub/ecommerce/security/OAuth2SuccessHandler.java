package com.shophub.ecommerce.security;

import com.shophub.ecommerce.model.User;
import com.shophub.ecommerce.repository.UserRepository;
import com.shophub.ecommerce.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String givenName = oAuth2User.getAttribute("given_name");
        String familyName = oAuth2User.getAttribute("family_name");
        String picture = oAuth2User.getAttribute("picture");

        if (email == null) {
            log.error("OAuth2 login failed: email not provided by Google");
            response.sendRedirect(getFrontendUrl() + "/auth/user?error=email_not_provided");
            return;
        }

        // Find or create user
        Optional<User> existingUser = userRepository.findByEmail(email);
        User user;

        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update profile image if available
            if (picture != null && (user.getProfileImage() == null || user.getProfileImage().isEmpty())) {
                user.setProfileImage(picture);
                userRepository.save(user);
            }
        } else {
            // Create new user for Google OAuth login
            user = User.builder()
                    .firstName(givenName != null ? givenName : "")
                    .lastName(familyName != null ? familyName : "")
                    .email(email)
                    .profileImage(picture != null ? picture : "")
                    .password("") // No password for OAuth users
                    .roles(new ArrayList<>(List.of("USER")))
                    .cartItems(new ArrayList<>())
                    .address(new ArrayList<>())
                    .buyingProducts(new ArrayList<>())
                    .orders(new ArrayList<>())
                    .build();
            user = userRepository.save(user);
        }

        // Generate JWT
        String jwtToken = jwtService.generateToken(
                user.getId(), user.getEmail(), user.getFirstName(), user.getLastName());

        user.setJwtToken(jwtToken);
        userRepository.save(user);

        // Redirect to frontend with token
        String redirectUrl = getFrontendUrl() + "/oauth2/redirect?token=" + jwtToken;
        log.info("OAuth2 login successful for: {}. Redirecting to: {}", email, redirectUrl);
        response.sendRedirect(redirectUrl);
    }

    private String getFrontendUrl() {
        String[] origins = allowedOrigins.split(",");
        return origins.length > 0 ? origins[0].trim() : "http://localhost:5173";
    }
}
