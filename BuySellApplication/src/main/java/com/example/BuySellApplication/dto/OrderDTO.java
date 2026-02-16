package com.example.BuySellApplication.dto;

import com.example.BuySellApplication.entity.*;
import com.example.BuySellApplication.enums.OrderStatus;
import com.example.BuySellApplication.enums.PaymentMethod;

import jakarta.validation.constraints.*;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


public class OrderDTO {
    private Long id;
    private String orderNumber;
    private Long buyerId;
    private String buyerName;
    private Long productId;
    private String productName;
    private Long sellerId;
    private String sellerName;
    private BigDecimal totalAmount;
    private Integer quantity;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private String paymentReceiptUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public OrderDTO() {}
    public OrderDTO(Long id, String orderNumber, Long buyerId, String buyerName, Long productId, String productName, Long sellerId, String sellerName, BigDecimal totalAmount, Integer quantity, OrderStatus status, PaymentMethod paymentMethod, String paymentReceiptUrl, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id; this.orderNumber = orderNumber; this.buyerId = buyerId; this.buyerName = buyerName; this.productId = productId; this.productName = productName; this.sellerId = sellerId; this.sellerName = sellerName; this.totalAmount = totalAmount; this.quantity = quantity; this.status = status; this.paymentMethod = paymentMethod; this.paymentReceiptUrl = paymentReceiptUrl; this.createdAt = createdAt; this.updatedAt = updatedAt;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }
    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }
    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getPaymentReceiptUrl() { return paymentReceiptUrl; }
    public void setPaymentReceiptUrl(String paymentReceiptUrl) { this.paymentReceiptUrl = paymentReceiptUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}