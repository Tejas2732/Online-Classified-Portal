package com.example.BuySellApplication.dto;

import com.example.BuySellApplication.entity.*;
import com.example.BuySellApplication.enums.ProductStatus;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Long categoryId;
    private String categoryName;
    private Long sellerId;
    private String sellerName;
    private ProductStatus status;
    private String imageUrl;
    private Integer quantity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // for sellers phone number
    private String sellerPhone;
    public String getSellerPhone(){
        return sellerPhone;
    }
    public void setSellerPhone(String sellerPhone){
        this.sellerPhone = sellerPhone;
    }


    //  for sellers address
    private String sellerAddress;
    // getters & setters
    public String getSellerAddress() {
        return sellerAddress;
    }
    public void setSellerAddress(String sellerAddress) {
        this.sellerAddress = sellerAddress;
    }

    public ProductDTO() {}


    public ProductDTO(Long id, String name, String description, BigDecimal price, Long categoryId, String categoryName, Long sellerId, String sellerName, ProductStatus status, String imageUrl, Integer quantity, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id; this.name = name; this.description = description; this.price = price; this.categoryId = categoryId; this.categoryName = categoryName; this.sellerId = sellerId; this.sellerName = sellerName; this.status = status; this.imageUrl = imageUrl; this.quantity = quantity; this.createdAt = createdAt; this.updatedAt = updatedAt;
    }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }
    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }
    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}