package com.example.BuySellApplication.controller;

import com.example.BuySellApplication.dto.*;
import com.example.BuySellApplication.entity.*;
import com.example.BuySellApplication.enums.*;
import com.example.BuySellApplication.exception.*;
import com.example.BuySellApplication.repository.*;
import com.example.BuySellApplication.security.*;
import com.example.BuySellApplication.service.*;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ============= Admin Controller =============
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAuthority('ADMIN')")
//@CrossOrigin(origins = "http://localhost:4200")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    private final AdminService adminService;
    private final UserService userService;

    // ✅ Constructor Injection (replaces @RequiredArgsConstructor)
    public AdminController(AdminService adminService, UserService userService) {
        this.adminService = adminService;
        this.userService = userService;
    }

    // changes
    @PatchMapping("/users/{id}/block")
    public ResponseEntity<ApiResponse<Void>> blockUser(@PathVariable Long id) {
        userService.blockUser(id);
        return ResponseEntity.ok(ApiResponse.success("User account has been blocked", null));
    }

    @PatchMapping("/users/{id}/unblock")
    public ResponseEntity<ApiResponse<Void>> unblockUser(@PathVariable Long id) {
        userService.unblockUser(id);
        return ResponseEntity.ok(ApiResponse.success("User account has been unblocked", null));
    }


    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getDashboardStats() {
        log.info("Admin dashboard stats requested");
        DashboardStatsDTO stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getAdminProfile() {
        UserDTO admin = userService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success("Admin profile retrieved", admin));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDTO>>> getAllUsers() {
        log.info("Admin: Get all users requested");
        List<UserDTO> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        log.info("Admin: Get user by id: {}", id);
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.success("User retrieved", user));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        log.info("Admin: Delete user request for id: {}", userId);
        adminService.deleteUserById(userId);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }

    @GetMapping("/products")
    public ResponseEntity<ApiResponse<List<ProductDTO>>> getAllProducts() {
        log.info("Admin: Get all products requested");
        List<ProductDTO> products = adminService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success("Products retrieved", products));
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long productId) {
        log.info("Admin: Delete product request for id: {}", productId);
        adminService.deleteProductById(productId);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    @DeleteMapping("/users/{userId}/products")
    public ResponseEntity<ApiResponse<Void>> deleteUserProducts(@PathVariable Long userId) {
        log.info("Admin: Delete all products for user id: {}", userId);
        adminService.deleteUserProducts(userId);
        return ResponseEntity.ok(ApiResponse.success("User products deleted successfully", null));
    }
    
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderDTO>>> getAllOrders() {
        log.info("Admin: Get all orders requested");
        List<OrderDTO> orders = adminService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved", orders));
    }
}
