package com.example.BuySellApplication.dto;

import com.example.BuySellApplication.entity.*;
import com.example.BuySellApplication.enums.TransactionType;

import jakarta.validation.constraints.*;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class TransactionDTO {
    private Long id;
    private TransactionType type;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String description;
    private Long orderId;
    private String orderNumber;
    private LocalDateTime createdAt;
    public TransactionDTO() {}
    public TransactionDTO(Long id, TransactionType type, BigDecimal amount, BigDecimal balanceAfter, String description, Long orderId, String orderNumber, LocalDateTime createdAt) {
        this.id = id; this.type = type; this.amount = amount; this.balanceAfter = balanceAfter; this.description = description; this.orderId = orderId; this.orderNumber = orderNumber; this.createdAt = createdAt;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public TransactionType getType() { return type; }
    public void setType(TransactionType type) { this.type = type; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public BigDecimal getBalanceAfter() { return balanceAfter; }
    public void setBalanceAfter(BigDecimal balanceAfter) { this.balanceAfter = balanceAfter; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}