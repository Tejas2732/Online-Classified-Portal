package com.example.BuySellApplication.dto;

import com.example.BuySellApplication.entity.*;
import jakarta.validation.constraints.*;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CreateCategoryRequest {
    @NotBlank(message = "Category name is required")
    private String name;
    private String description;
    public CreateCategoryRequest() {}
    public CreateCategoryRequest(String name, String description) {
        this.name = name; this.description = description;
    }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}