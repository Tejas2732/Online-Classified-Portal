package com.example.BuySellApplication.dto;

import com.example.BuySellApplication.entity.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class DashboardStatsDTO {
    private long totalUsers;
    private long totalActiveUsers;
    private long totalProducts;
    private long totalAvailableProducts;
    private long totalSoldProducts;
    private long totalOrders;
    private long totalCompletedOrders;
    private Double totalSales;
    private List<RecentOrderDTO> recentOrders;
    public DashboardStatsDTO() {}
    public DashboardStatsDTO(long totalUsers, long totalActiveUsers, long totalProducts, long totalAvailableProducts, long totalSoldProducts, long totalOrders, long totalCompletedOrders, Double totalSales, List<RecentOrderDTO> recentOrders) {
        this.totalUsers = totalUsers; this.totalActiveUsers = totalActiveUsers; this.totalProducts = totalProducts; this.totalAvailableProducts = totalAvailableProducts; this.totalSoldProducts = totalSoldProducts; this.totalOrders = totalOrders; this.totalCompletedOrders = totalCompletedOrders; this.totalSales = totalSales; this.recentOrders = recentOrders;
    }
    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getTotalActiveUsers() { return totalActiveUsers; }
    public void setTotalActiveUsers(long totalActiveUsers) { this.totalActiveUsers = totalActiveUsers; }
    public long getTotalProducts() { return totalProducts; }
    public void setTotalProducts(long totalProducts) { this.totalProducts = totalProducts; }
    public long getTotalAvailableProducts() { return totalAvailableProducts; }
    public void setTotalAvailableProducts(long totalAvailableProducts) { this.totalAvailableProducts = totalAvailableProducts; }
    public long getTotalSoldProducts() { return totalSoldProducts; }
    public void setTotalSoldProducts(long totalSoldProducts) { this.totalSoldProducts = totalSoldProducts; }
    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }
    public long getTotalCompletedOrders() { return totalCompletedOrders; }
    public void setTotalCompletedOrders(long totalCompletedOrders) { this.totalCompletedOrders = totalCompletedOrders; }
    public Double getTotalSales() { return totalSales; }
    public void setTotalSales(Double totalSales) { this.totalSales = totalSales; }
    public List<RecentOrderDTO> getRecentOrders() { return recentOrders; }
    public void setRecentOrders(List<RecentOrderDTO> recentOrders) { this.recentOrders = recentOrders; }
}