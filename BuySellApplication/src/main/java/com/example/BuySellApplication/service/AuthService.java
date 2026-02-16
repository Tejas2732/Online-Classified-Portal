package com.example.BuySellApplication.service;

import com.example.BuySellApplication.dto.*;
import com.example.BuySellApplication.entity.*;
import com.example.BuySellApplication.enums.*;
import com.example.BuySellApplication.exception.*;
import com.example.BuySellApplication.repository.*;
import com.example.BuySellApplication.security.*;
import com.example.BuySellApplication.service.*;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    // Constructor injection (replaces @RequiredArgsConstructor)
    public AuthService(UserRepository userRepository,
                       WalletRepository walletRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        log.info("Registering new user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }

        if (request.getPhoneNumber() != null &&
                userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateResourceException("Phone number already registered");
        }

        // ---- Create User (NO builder) ----
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setRole(Role.USER);
        user.setActive(true);

        user = userRepository.save(user);

        // ---- Create Wallet (NO builder) ----
        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setBalance(BigDecimal.ZERO);
        walletRepository.save(wallet);

        String jwtToken = jwtService.generateToken(createUserDetails(user));
        String refreshToken = jwtService.generateRefreshToken(createUserDetails(user));

        log.info("User registered successfully: {}", user.getEmail());

        // ---- Build AuthResponse manually ----
        AuthResponse response = new AuthResponse();
        response.setToken(jwtToken);
        response.setRefreshToken(refreshToken);
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());

        return response;
    }

    public AuthResponse login(LoginRequest request) {

        log.info("Login attempt for email: {}", request.getEmail());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getActive()) {
            throw new UnauthorizedException("Account is deactivated");
        }

        if (user.isBlocked()) {
            throw new DisabledException("Your account has been blocked by admin.");
        }

        String jwtToken = jwtService.generateToken(createUserDetails(user));
        String refreshToken = jwtService.generateRefreshToken(createUserDetails(user));

        log.info("User logged in successfully: {}", user.getEmail());

        AuthResponse response = new AuthResponse();
        response.setToken(jwtToken);
        response.setRefreshToken(refreshToken);
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setFullName(user.getFullName());
        response.setRole(user.getRole());

        return response;
    }

    private org.springframework.security.core.userdetails.User createUserDetails(User user) {
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(
                        new org.springframework.security.core.authority
                                .SimpleGrantedAuthority(user.getRole().name())
                )
        );
    }
}
