package com.example.BuySellApplication.dto;

import com.example.BuySellApplication.entity.*;
import com.example.BuySellApplication.enums.PaymentMethod;

import jakarta.validation.constraints.*;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


public class OrderReceiptDTO {
    private String orderNumber;
    private String buyerName;
    private String productName;
    private BigDecimal totalAmount;
    private Integer quantity;
    private PaymentMethod paymentMethod;
    private LocalDateTime orderDate;
    private String receiptUrl;
    public OrderReceiptDTO() {}
    public OrderReceiptDTO(String orderNumber, String buyerName, String productName, BigDecimal totalAmount, Integer quantity, PaymentMethod paymentMethod, LocalDateTime orderDate, String receiptUrl) {
        this.orderNumber = orderNumber; this.buyerName = buyerName; this.productName = productName; this.totalAmount = totalAmount; this.quantity = quantity; this.paymentMethod = paymentMethod; this.orderDate = orderDate; this.receiptUrl = receiptUrl;
    }
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
    public String getReceiptUrl() { return receiptUrl; }
    public void setReceiptUrl(String receiptUrl) { this.receiptUrl = receiptUrl; }
}