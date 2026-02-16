package com.example.BuySellApplication.dto;

import com.example.BuySellApplication.entity.*;
import com.example.BuySellApplication.enums.Role;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class UserDTO {
    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String address;
    private Role role;
    private Boolean active;
    private BigDecimal walletBalance;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    public UserDTO() {}
    public UserDTO(Long id, String email, String fullName, String phoneNumber, String address, Role role, Boolean active, BigDecimal walletBalance, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id; this.email = email; this.fullName = fullName; this.phoneNumber = phoneNumber; this.address = address; this.role = role; this.active = active; this.walletBalance = walletBalance; this.createdAt = createdAt; this.updatedAt = updatedAt;
    }

    // changes
    private boolean blocked; // ✅ Add this field

    // Getters and Setters
    public boolean isBlocked() { return blocked; }
    public void setBlocked(boolean blocked) { this.blocked = blocked; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
    public BigDecimal getWalletBalance() { return walletBalance; }
    public void setWalletBalance(BigDecimal walletBalance) { this.walletBalance = walletBalance; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}