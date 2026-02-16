package com.example.BuySellApplication.controller;

import com.example.BuySellApplication.dto.*;
import com.example.BuySellApplication.service.AuthService;
import com.example.BuySellApplication.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;
    private final UserService userService ;  // changes

    // Constructor injection (replaces @RequiredArgsConstructor)
    public AuthController(AuthService authService , UserService userService) {
        this.authService = authService;
        this.userService = userService;
    }


    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {

        log.info("Registration request received for email: {}", request.getEmail());

        AuthResponse response = authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully", response));
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        log.info("Login request received for email: {}", request.getEmail());

        try {
            // This method will trigger the DisabledException if the user is blocked
            AuthResponse response = authService.login(request);

            return ResponseEntity.ok(
                    ApiResponse.success("Login successful", response)
            );
        } catch (DisabledException e) {
            // This catches the specific block error and sends a 403 Forbidden
            log.warn("Login failed: User {} is blocked", request.getEmail());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error(e.getMessage())); // "You are blocked by the admin"
        } catch (BadCredentialsException e) {
            // Optional: Catch wrong password/email and send 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid email or password"));
        } catch (Exception e) {
            // Catch-all for any other unexpected errors
            log.error("Unexpected login error: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("An unexpected error occurred during login"));
        }
    }

// for password changing it should be public
@PutMapping("/forgot-password")
public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
    userService.resetPasswordByEmail(request);
    return ResponseEntity.ok(ApiResponse.success("Password updated successfully", null));
}


//    @PostMapping("/login")
//    public ResponseEntity<ApiResponse<AuthResponse>> login(
//            @Valid @RequestBody LoginRequest request) {
//
//        log.info("Login request received for email: {}", request.getEmail());
//
//        AuthResponse response = authService.login(request);
//
//        return ResponseEntity.ok(
//                ApiResponse.success("Login successful", response)
//        );
//    }


    @PostMapping("/admin/login")
    public ResponseEntity<ApiResponse<AuthResponse>> adminLogin(
            @Valid @RequestBody LoginRequest request) {

        log.info("Admin login request received for email: {}", request.getEmail());

        AuthResponse response = authService.login(request);

        // Ensure only ADMIN can login here
        if (!"ADMIN".equals(response.getRole().name())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied. Admin credentials required."));
        }

        return ResponseEntity.ok(
                ApiResponse.success("Admin login successful", response)
        );
    }
}
