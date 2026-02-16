package com.example.BuySellApplication.service;

import com.example.BuySellApplication.dto.*;
import com.example.BuySellApplication.entity.*;
import com.example.BuySellApplication.enums.*;
import com.example.BuySellApplication.exception.*;
import com.example.BuySellApplication.repository.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserService userService;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          UserService userService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userService = userService;
    }

    // ================= CREATE =================
    @Transactional
    public ProductDTO createProduct(CreateProductRequest request) {

        User seller = userService.getCurrentAuthenticatedUser();
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setSeller(seller);
        product.setStatus(ProductStatus.AVAILABLE);
        product.setImageUrl(request.getImageUrl());
        product.setQuantity(request.getQuantity());

        productRepository.save(product);
        log.info("Product created: {}", product.getName());

        return mapToDTO(product);
    }

    // ================= UPDATE =================
    @Transactional
    public ProductDTO updateProduct(Long id, UpdateProductRequest request) {

        User user = userService.getCurrentAuthenticatedUser();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getSeller().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can update only your products");
        }

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getImageUrl() != null) product.setImageUrl(request.getImageUrl());
        if (request.getQuantity() != null) product.setQuantity(request.getQuantity());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }

        productRepository.save(product);
        return mapToDTO(product);
    }

    // ================= DELETE =================
    @Transactional
    public void deleteProduct(Long id) {

        User user = userService.getCurrentAuthenticatedUser();
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getSeller().getId().equals(user.getId())
                && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Not allowed");
        }

        product.setStatus(ProductStatus.DELETED);
        productRepository.save(product);
    }

    // ================= READ =================
    public ProductDTO getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    public List<ProductDTO> getMyProducts() {
        User user = userService.getCurrentAuthenticatedUser();
        return productRepository.findBySellerId(user.getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PageResponse<ProductDTO> getMyProductsPaginated(Pageable pageable) {
        User user = userService.getCurrentAuthenticatedUser();
        Page<Product> page = productRepository.findBySellerId(user.getId(), pageable);
        return buildPageResponse(page);
    }

    public PageResponse<ProductDTO> getAvailableProducts(Pageable pageable) {
        Page<Product> page = productRepository
                .findByStatus(ProductStatus.AVAILABLE, pageable);
        return buildPageResponse(page);
    }

    public PageResponse<ProductDTO> searchProducts(String keyword, Pageable pageable) {
        Page<Product> page = productRepository
                .searchAvailableProducts(keyword, pageable);
        return buildPageResponse(page);
    }

    public PageResponse<ProductDTO> getProductsByCategory(Long categoryId, Pageable pageable) {
        Page<Product> page = productRepository
                .findByCategoryIdAndStatus(categoryId, ProductStatus.AVAILABLE, pageable);
        return buildPageResponse(page);
    }

    // ================= HELPERS =================
    private PageResponse<ProductDTO> buildPageResponse(Page<Product> page) {
        return new PageResponse<>(
                page.getContent().stream().map(this::mapToDTO).collect(Collectors.toList()),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.isLast()
        );
    }

    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setCategoryId(product.getCategory().getId());
        dto.setCategoryName(product.getCategory().getName());
        dto.setSellerId(product.getSeller().getId());
        dto.setSellerName(product.getSeller().getFullName());
        dto.setStatus(product.getStatus());
        dto.setImageUrl(product.getImageUrl());
        dto.setQuantity(product.getQuantity());
        dto.setCreatedAt(product.getCreatedAt());
        dto.setUpdatedAt(product.getUpdatedAt());

        // for location / adrress
        dto.setSellerAddress(product.getSeller().getAddress());

        // for phone number
        dto.setSellerPhone(product.getSeller().getPhoneNumber());

        return dto;
    }
}
