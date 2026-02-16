package com.example.BuySellApplication.dto;

import com.example.BuySellApplication.entity.*;
import com.example.BuySellApplication.enums.OrderStatus;

import jakarta.validation.constraints.*;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


public class RecentOrderDTO {
    private Long id;
    private String orderNumber;
    private String buyerName;
    private String productName;
    private BigDecimal amount;
    private OrderStatus status;
    private LocalDateTime createdAt;
    public RecentOrderDTO() {}
    public RecentOrderDTO(Long id, String orderNumber, String buyerName, String productName, BigDecimal amount, OrderStatus status, LocalDateTime createdAt) {
        this.id = id; this.orderNumber = orderNumber; this.buyerName = buyerName; this.productName = productName; this.amount = amount; this.status = status; this.createdAt = createdAt;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}