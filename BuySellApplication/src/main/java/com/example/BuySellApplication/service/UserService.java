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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       WalletRepository walletRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO getCurrentUser() {
        User user = getCurrentAuthenticatedUser();
        return mapToDTO(user);
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found with id: " + id)
                );
        return mapToDTO(user);
    }


    // changes -> for delete
//    @Transactional
//    public void deleteUser(Long userId) {
//        log.info("Starting permanent deletion for user ID: {}", userId);
//
//        // 1. Find the user
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
//
//        // 2. Handle Cardinality: Delete the Wallet first
//        // (Since Wallet is linked to User, we clean this up to maintain integrity)
//        walletRepository.findByUserId(userId).ifPresent(wallet -> {
//            walletRepository.delete(wallet);
//            log.info("Associated wallet deleted for user: {}", user.getEmail());
//        });
//
//        // 3. Delete other related entities here if you have them
//        // e.g., orderRepository.deleteByUserId(userId);
//
//        // 4. Finally, delete the user
//        userRepository.delete(user);
//
//        log.info("User permanently deleted: {}", user.getEmail());
//    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDTO updateProfile(UpdateUserRequest request) {

        User user = getCurrentAuthenticatedUser();

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }

        if (request.getPhoneNumber() != null) {
            if (userRepository.existsByPhoneNumber(request.getPhoneNumber()) &&
                    !request.getPhoneNumber().equals(user.getPhoneNumber())) {
                throw new DuplicateResourceException("Phone number already in use");
            }
            user.setPhoneNumber(request.getPhoneNumber());
        }

        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        user = userRepository.save(user);
        log.info("User profile updated: {}", user.getEmail());

        return mapToDTO(user);
    }

    // making changes in this file
    @Transactional
    public void changePassword(ChangePasswordRequest request) {

        User user = getCurrentAuthenticatedUser();

        if (!passwordEncoder.matches(
                request.getOldPassword(),
                user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        log.info("Password changed for user: {}", user.getEmail());
    }

    // changes for the changing password
    @Transactional
    public void resetPasswordByEmail(ForgotPasswordRequest request) {
        log.info("Resetting password for email: {}", request.getEmail());

        // 1. Find user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        // 2. Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // 3. Save
        userRepository.save(user);
        log.info("Password updated successfully for: {}", request.getEmail());
    }

    // already have delete user ->>>>>>
    @Transactional
    public void deleteUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );

        userRepository.delete(user);
        log.info("User deleted: {}", user.getEmail());
    }

    public User getCurrentAuthenticatedUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found")
                );
    }

    private UserDTO mapToDTO(User user) {

        BigDecimal walletBalance =
                walletRepository.findByUserId(user.getId())
                        .map(Wallet::getBalance)
                        .orElse(BigDecimal.ZERO);

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole());
        dto.setActive(user.getActive());
        dto.setWalletBalance(walletBalance);
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        dto.setBlocked(user.isBlocked());

        return dto;
    }

    // changes
    /**
     * Blocks a user by their ID
     */
    public void blockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setBlocked(true);
        userRepository.save(user);
        log.info("User with ID {} has been BLOCKED", id);
    }

    /**
     * Unblocks a user by their ID
     */
    public void unblockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setBlocked(false);
        userRepository.save(user);
        log.info("User with ID {} has been UNBLOCKED", id);
    }

}
