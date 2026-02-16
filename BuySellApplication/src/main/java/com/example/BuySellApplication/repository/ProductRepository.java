package com.example.BuySellApplication.repository;


import com.example.BuySellApplication.entity.*;
import com.example.BuySellApplication.enums.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;




@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStatus(ProductStatus status);
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);
    List<Product> findBySellerId(Long sellerId);
    Page<Product> findBySellerId(Long sellerId, Pageable pageable);
    List<Product> findByCategoryId(Long categoryId);
    Page<Product> findByCategoryIdAndStatus(Long categoryId, ProductStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'AVAILABLE' AND p.seller.id != :userId")
    Page<Product> findAvailableProductsExcludingSeller(@Param("userId") Long userId, Pageable pageable);
    
    @Query("SELECT p FROM Product p WHERE p.status = 'AVAILABLE' AND " +
           "(LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> searchAvailableProducts(@Param("keyword") String keyword, Pageable pageable);
    
    long countByStatus(ProductStatus status);
    long countBySellerId(Long sellerId);
}
