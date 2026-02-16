package com.example.BuySellApplication.dto;

import com.example.BuySellApplication.entity.*;
import com.example.BuySellApplication.enums.PaymentMethod;

import jakarta.validation.constraints.*;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;


public class CreateOrderRequest {
    @NotNull(message = "Product ID is required")
    private Long productId;
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;
    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;
    private CardPaymentDetails cardDetails;
    public CreateOrderRequest() {}
    public CreateOrderRequest(Long productId, Integer quantity, PaymentMethod paymentMethod, CardPaymentDetails cardDetails) {
        this.productId = productId; this.quantity = quantity; this.paymentMethod = paymentMethod; this.cardDetails = cardDetails;
    }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public PaymentMethod getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(PaymentMethod paymentMethod) { this.paymentMethod = paymentMethod; }
    public CardPaymentDetails getCardDetails() { return cardDetails; }
    public void setCardDetails(CardPaymentDetails cardDetails) { this.cardDetails = cardDetails; }
}