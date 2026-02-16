package com.example.BuySellApplication.service;

import com.example.BuySellApplication.dto.*;
import com.example.BuySellApplication.entity.*;
import com.example.BuySellApplication.enums.*;
import com.example.BuySellApplication.exception.*;
import com.example.BuySellApplication.repository.*;
import com.example.BuySellApplication.security.*;
import com.example.BuySellApplication.service.*;


import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
 
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final UserService userService;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        WalletRepository walletRepository,
                        TransactionRepository transactionRepository,
                        UserService userService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.userService = userService;
    }

    // changes
    @Transactional
    public OrderReceiptDTO createOrder(CreateOrderRequest request) {

        User buyer = userService.getCurrentAuthenticatedUser();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (product.getStatus() != ProductStatus.AVAILABLE) {
            throw new BadRequestException("Product is not available");
        }

        if (product.getSeller().getId().equals(buyer.getId())) {
            throw new BadRequestException("Cannot buy your own product");
        }

        if (product.getQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient product quantity");
        }

        BigDecimal totalAmount =
                product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));

        // ✅ STEP 1: Create & save order FIRST (needed for transactions)
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setBuyer(buyer);
        order.setProduct(product);
        order.setTotalAmount(totalAmount);
        order.setQuantity(request.getQuantity());
        order.setStatus(OrderStatus.COMPLETED);
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentReceiptUrl(generateReceiptUrl());

        orderRepository.save(order);

        // ✅ STEP 2: Process payment (wallet/card)
        if (request.getPaymentMethod() == PaymentMethod.WALLET) {
            processWalletPayment(
                    buyer,
                    product.getSeller(),
                    totalAmount,
                    order
            );
        } else {
            processCardPayment(
                    request.getCardDetails(),
                    product.getSeller(),
                    totalAmount,
                    order
            );
        }

        // ✅ STEP 3: Update product quantity
        product.setQuantity(product.getQuantity() - request.getQuantity());
        if (product.getQuantity() == 0) {
            product.setStatus(ProductStatus.SOLD);
        }
        productRepository.save(product);

        log.info("Order created successfully: {}", order.getOrderNumber());

        // ✅ STEP 4: Build receipt
        OrderReceiptDTO receipt = new OrderReceiptDTO();
        receipt.setOrderNumber(order.getOrderNumber());
        receipt.setBuyerName(buyer.getFullName());
        receipt.setProductName(product.getName());
        receipt.setTotalAmount(totalAmount);
        receipt.setQuantity(request.getQuantity());
        receipt.setPaymentMethod(request.getPaymentMethod());
        receipt.setOrderDate(order.getCreatedAt());
        receipt.setReceiptUrl(order.getPaymentReceiptUrl());

        return receipt;
    }



//    @Transactional
//    public OrderReceiptDTO createOrder(CreateOrderRequest request) {
//
//        User buyer = userService.getCurrentAuthenticatedUser();
//
//        Product product = productRepository.findById(request.getProductId())
//                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
//
//        if (product.getStatus() != ProductStatus.AVAILABLE) {
//            throw new BadRequestException("Product is not available");
//        }
//
//        if (product.getSeller().getId().equals(buyer.getId())) {
//            throw new BadRequestException("Cannot buy your own product");
//        }
//
//        if (product.getQuantity() < request.getQuantity()) {
//            throw new BadRequestException("Insufficient product quantity");
//        }
//
//        BigDecimal totalAmount =
//                product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));
//
//        if (request.getPaymentMethod() == PaymentMethod.WALLET) {
//            processWalletPayment(buyer, product.getSeller(), totalAmount);
//        } else {
//            processCardPayment(request.getCardDetails(), totalAmount);
//        }
//
//        Order order = new Order();
//        order.setOrderNumber(generateOrderNumber());
//        order.setBuyer(buyer);
//        order.setProduct(product);
//        order.setTotalAmount(totalAmount);
//        order.setQuantity(request.getQuantity());
//        order.setStatus(OrderStatus.COMPLETED);
//        order.setPaymentMethod(request.getPaymentMethod());
//        order.setPaymentReceiptUrl(generateReceiptUrl());
//
//        orderRepository.save(order);
//
//        product.setQuantity(product.getQuantity() - request.getQuantity());
//        if (product.getQuantity() == 0) {
//            product.setStatus(ProductStatus.SOLD);
//        }
//        productRepository.save(product);
//
//        log.info("Order created: {}", order.getOrderNumber());
//
//        OrderReceiptDTO receipt = new OrderReceiptDTO();
//        receipt.setOrderNumber(order.getOrderNumber());
//        receipt.setBuyerName(buyer.getFullName());
//        receipt.setProductName(product.getName());
//        receipt.setTotalAmount(totalAmount);
//        receipt.setQuantity(request.getQuantity());
//        receipt.setPaymentMethod(request.getPaymentMethod());
//        receipt.setOrderDate(order.getCreatedAt());
//        receipt.setReceiptUrl(order.getPaymentReceiptUrl());
//
//        return receipt;
//    }

    // chnage s
    private void processWalletPayment(
            User buyer,
            User seller,
            BigDecimal amount,
            Order order
    ) {

        // ✅ Get or create buyer wallet
        Wallet buyerWallet = walletRepository.findByUserId(buyer.getId())
                .orElseGet(() -> {
                    Wallet w = new Wallet();
                    w.setUser(buyer);
                    w.setBalance(BigDecimal.ZERO);
                    return walletRepository.save(w);
                });

        // ✅ Balance check
        if (buyerWallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient wallet balance");
        }

        // ✅ Get or create seller wallet
        Wallet sellerWallet = walletRepository.findByUserId(seller.getId())
                .orElseGet(() -> {
                    Wallet w = new Wallet();
                    w.setUser(seller);
                    w.setBalance(BigDecimal.ZERO);
                    return walletRepository.save(w);
                });

        // 🔻 Debit buyer
        BigDecimal buyerBalanceAfter =
                buyerWallet.getBalance().subtract(amount);
        buyerWallet.setBalance(buyerBalanceAfter);

        // 🔺 Credit seller
        BigDecimal sellerBalanceAfter =
                sellerWallet.getBalance().add(amount);
        sellerWallet.setBalance(sellerBalanceAfter);

        walletRepository.save(buyerWallet);
        walletRepository.save(sellerWallet);

        // 🧾 Buyer transaction (DEBIT)
        Transaction buyerTxn = new Transaction();
        buyerTxn.setWallet(buyerWallet);
        buyerTxn.setOrder(order);
        buyerTxn.setAmount(amount.negate());
        buyerTxn.setType(TransactionType.DEBIT);
        buyerTxn.setBalanceAfter(buyerBalanceAfter); // ⭐ IMPORTANT
        buyerTxn.setDescription("Order payment");

        // 🧾 Seller transaction (CREDIT)
        Transaction sellerTxn = new Transaction();
        sellerTxn.setWallet(sellerWallet);
        sellerTxn.setOrder(order);
        sellerTxn.setAmount(amount);
        sellerTxn.setType(TransactionType.CREDIT);
        sellerTxn.setBalanceAfter(sellerBalanceAfter); // ⭐ IMPORTANT
        sellerTxn.setDescription("Product sold");

        transactionRepository.save(buyerTxn);
        transactionRepository.save(sellerTxn);
    }


//    private void processWalletPayment(User buyer, User seller, BigDecimal amount) {
//
//        Wallet buyerWallet = walletRepository.findByUserId(buyer.getId())
//                .orElseThrow(() -> new ResourceNotFoundException("Buyer wallet not found"));
//
//        if (buyerWallet.getBalance().compareTo(amount) < 0) {
//            throw new InsufficientBalanceException("Insufficient wallet balance");
//        }
//
//        buyerWallet.setBalance(buyerWallet.getBalance().subtract(amount));
//        walletRepository.save(buyerWallet);
//
//        Wallet sellerWallet = walletRepository.findByUserId(seller.getId())
//                .orElseThrow(() -> new ResourceNotFoundException("Seller wallet not found"));
//
//        sellerWallet.setBalance(sellerWallet.getBalance().add(amount));
//        walletRepository.save(sellerWallet);
//
//        log.info("Wallet payment {} from {} to {}", amount, buyer.getEmail(), seller.getEmail());
//    }


    private void processCardPayment(
            CardPaymentDetails cardDetails,
            User seller,
            BigDecimal amount,
            Order order
    ) {
        if (cardDetails == null) {
            throw new BadRequestException("Card details required");
        }

        Wallet sellerWallet = walletRepository.findByUserId(seller.getId())
                .orElseGet(() -> {
                    Wallet w = new Wallet();
                    w.setUser(seller);
                    w.setBalance(BigDecimal.ZERO);
                    return walletRepository.save(w);
                });

        BigDecimal sellerBalanceAfter =
                sellerWallet.getBalance().add(amount);

        sellerWallet.setBalance(sellerBalanceAfter);
        walletRepository.save(sellerWallet);

        Transaction sellerTxn = new Transaction();
        sellerTxn.setWallet(sellerWallet);
        sellerTxn.setOrder(order);
        sellerTxn.setType(TransactionType.CREDIT);
        sellerTxn.setAmount(amount);
        sellerTxn.setBalanceAfter(sellerBalanceAfter); // ⭐ REQUIRED
        sellerTxn.setDescription("Card payment received");

        transactionRepository.save(sellerTxn);
    }

    // chanegs
//    private void processCardPayment(CardPaymentDetails cardDetails, BigDecimal amount) {
//        if (cardDetails == null) {
//            throw new BadRequestException("Card details required");
//        }
//        log.info("Card payment processed: {}", amount);
//    }

    public List<OrderDTO> getMyOrders() {
        return orderRepository.findByBuyerId(
                        userService.getCurrentAuthenticatedUser().getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PageResponse<OrderDTO> getMyOrdersPaginated(Pageable pageable) {
        Page<Order> page = orderRepository.findByBuyerId(
                userService.getCurrentAuthenticatedUser().getId(), pageable);
        return createPageResponse(page);
    }

    public List<OrderDTO> getMySales() {
        return orderRepository.findByProductSellerId(
                        userService.getCurrentAuthenticatedUser().getId())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PageResponse<OrderDTO> getMySalesPaginated(Pageable pageable) {
        Page<Order> page = orderRepository.findByProductSellerId(
                userService.getCurrentAuthenticatedUser().getId(), pageable);
        return createPageResponse(page);
    }

    public OrderDTO getOrderById(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        User user = userService.getCurrentAuthenticatedUser();

        if (!order.getBuyer().getId().equals(user.getId())
                && !order.getProduct().getSeller().getId().equals(user.getId())
                && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Access denied");
        }

        return mapToDTO(order);
    }

    @Transactional
    public void deleteOrder(Long id) {

        User user = userService.getCurrentAuthenticatedUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getBuyer().getId().equals(user.getId())
                && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Cannot delete this order");
        }

        orderRepository.delete(order);
        log.info("Order deleted: {}", order.getOrderNumber());
    }

    private String generateOrderNumber() {
        return "ORD-" +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private String generateReceiptUrl() {
        return "/receipts/" + UUID.randomUUID() + ".pdf";
    }

    private PageResponse<OrderDTO> createPageResponse(Page<Order> page) {

        PageResponse<OrderDTO> response = new PageResponse<>();
        response.setContent(
                page.getContent().stream()
                        .map(this::mapToDTO)
                        .collect(Collectors.toList()));
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setLast(page.isLast());

        return response;
    }

    private OrderDTO mapToDTO(Order order) {

        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setBuyerId(order.getBuyer().getId());
        dto.setBuyerName(order.getBuyer().getFullName());
        dto.setProductId(order.getProduct().getId());
        dto.setProductName(order.getProduct().getName());
        dto.setSellerId(order.getProduct().getSeller().getId());
        dto.setSellerName(order.getProduct().getSeller().getFullName());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setQuantity(order.getQuantity());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentReceiptUrl(order.getPaymentReceiptUrl());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());

        return dto;
    }
}
