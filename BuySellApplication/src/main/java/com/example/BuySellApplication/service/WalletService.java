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
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WalletService {

    private static final Logger log = LoggerFactory.getLogger(WalletService.class);

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final UserService userService;

    public WalletService(WalletRepository walletRepository,
                         TransactionRepository transactionRepository,
                         UserService userService) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.userService = userService;
    }

    public WalletDTO getMyWallet() {
        User user = userService.getCurrentAuthenticatedUser();
        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        return mapToDTO(wallet);
    }

    @Transactional
    public WalletDTO rechargeWallet(RechargeWalletRequest request) {

        User user = userService.getCurrentAuthenticatedUser();
        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        BigDecimal newBalance = wallet.getBalance().add(request.getAmount());
        wallet.setBalance(newBalance);

        Transaction transaction = new Transaction();
        transaction.setWallet(wallet);
        transaction.setType(TransactionType.RECHARGE);
        transaction.setAmount(request.getAmount());
        transaction.setBalanceAfter(newBalance);
        transaction.setDescription("Wallet recharge via " + request.getPaymentMethod());

        transactionRepository.save(transaction);
        walletRepository.save(wallet);

        log.info("Wallet recharged for user {} amount {}", user.getEmail(), request.getAmount());

        return mapToDTO(wallet);
    }

    public List<TransactionDTO> getMyTransactions() {
        User user = userService.getCurrentAuthenticatedUser();

        return transactionRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::mapTransactionToDTO)
                .collect(Collectors.toList());
    }

    public PageResponse<TransactionDTO> getMyTransactionsPaginated(Pageable pageable) {

        User user = userService.getCurrentAuthenticatedUser();
        Wallet wallet = walletRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        Page<Transaction> page =
                transactionRepository.findByWalletId(wallet.getId(), pageable);

        PageResponse<TransactionDTO> response = new PageResponse<>();
        response.setContent(
                page.getContent().stream()
                        .map(this::mapTransactionToDTO)
                        .collect(Collectors.toList())
        );
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalElements(page.getTotalElements());
        response.setTotalPages(page.getTotalPages());
        response.setLast(page.isLast());

        return response;
    }

    private WalletDTO mapToDTO(Wallet wallet) {
        WalletDTO dto = new WalletDTO();
        dto.setId(wallet.getId());
        dto.setUserId(wallet.getUser().getId());
        dto.setBalance(wallet.getBalance());
        dto.setCreatedAt(wallet.getCreatedAt());
        dto.setUpdatedAt(wallet.getUpdatedAt());
        return dto;
    }

    private TransactionDTO mapTransactionToDTO(Transaction tx) {
        TransactionDTO dto = new TransactionDTO();
        dto.setId(tx.getId());
        dto.setType(tx.getType());
        dto.setAmount(tx.getAmount());
        dto.setBalanceAfter(tx.getBalanceAfter());
        dto.setDescription(tx.getDescription());
        dto.setOrderId(tx.getOrder() != null ? tx.getOrder().getId() : null);
        dto.setOrderNumber(tx.getOrder() != null ? tx.getOrder().getOrderNumber() : null);
        dto.setCreatedAt(tx.getCreatedAt());
        return dto;
    }
}
