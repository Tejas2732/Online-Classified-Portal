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
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    public AdminService(UserRepository userRepository,
                        ProductRepository productRepository,
                        OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    public DashboardStatsDTO getDashboardStats() {

        DashboardStatsDTO dto = new DashboardStatsDTO();

        dto.setTotalUsers(userRepository.countByRole(Role.USER));
        dto.setTotalActiveUsers(userRepository.countByActiveTrue());
        dto.setTotalProducts(productRepository.count());
        dto.setTotalAvailableProducts(productRepository.countByStatus(ProductStatus.AVAILABLE));
        dto.setTotalSoldProducts(productRepository.countByStatus(ProductStatus.SOLD));
        dto.setTotalOrders(orderRepository.count());
        dto.setTotalCompletedOrders(orderRepository.countCompletedOrders());

        Double totalSales = orderRepository.getTotalSales();
        dto.setTotalSales(totalSales != null ? totalSales : 0.0);

        List<RecentOrderDTO> recentOrders =
                orderRepository.findAll().stream()
                        .filter(order -> order.getCreatedAt() != null)
                        .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                        .limit(10)
                        .map(this::mapRecentOrder)
                        .collect(Collectors.toList());

        dto.setRecentOrders(recentOrders);
        return dto;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapUserToDTO)
                .collect(Collectors.toList());
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapProductToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapOrderToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUserById(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot delete admin");
        }

        userRepository.delete(user);
        log.info("Admin deleted user {}", user.getEmail());
    }

    @Transactional
    public void deleteProductById(Long productId) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setStatus(ProductStatus.DELETED);
        productRepository.save(product);
        log.info("Admin deleted product {}", product.getName());
    }

    private RecentOrderDTO mapRecentOrder(Order order) {
        RecentOrderDTO dto = new RecentOrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setBuyerName(order.getBuyer().getFullName());
        dto.setProductName(order.getProduct().getName());
        dto.setAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }

    private UserDTO mapUserToDTO(User user) {

        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setAddress(user.getAddress());
        dto.setRole(user.getRole());
        dto.setActive(user.getActive());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }

    private ProductDTO mapProductToDTO(Product product) {

        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
        dto.setSellerId(product.getSeller().getId());
        dto.setSellerName(product.getSeller().getFullName());
        dto.setStatus(product.getStatus());
        dto.setImageUrl(product.getImageUrl());
        dto.setQuantity(product.getQuantity());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());
        return dto;
    }

    private OrderDTO mapOrderToDTO(Order order) {

        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setBuyerId(order.getBuyer().getId());
        dto.setBuyerName(order.getBuyer().getFullName());
        dto.setProductId(order.getProduct().getId());
        dto.setProductName(order.getProduct().getName());
        dto.setSellerId(order.getProduct().getSeller().getId());
        dto.setSellerName(order.getProduct().getSeller().getFullName());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setQuantity(order.getQuantity());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentReceiptUrl(order.getPaymentReceiptUrl());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        return dto;
    }

    @Transactional
    public void deleteUserProducts(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot delete products of admin");
        }

        List<Product> products = productRepository.findBySellerId(userId);

        for (Product product : products) {
            product.setStatus(ProductStatus.DELETED);
        }

        productRepository.saveAll(products);

        log.info("Admin deleted {} products for user {}", products.size(), user.getEmail());
    }




}
