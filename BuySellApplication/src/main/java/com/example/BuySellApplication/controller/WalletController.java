package com.example.BuySellApplication.controller;


import com.example.BuySellApplication.dto.*;
import com.example.BuySellApplication.entity.*;
import com.example.BuySellApplication.enums.*;
import com.example.BuySellApplication.exception.*;
import com.example.BuySellApplication.repository.*;
import com.example.BuySellApplication.security.*;
import com.example.BuySellApplication.service.*;


import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*")
public class WalletController {

    private static final Logger log = LoggerFactory.getLogger(WalletController.class);

    private final WalletService walletService;

    // Constructor injection (replaces @RequiredArgsConstructor)
    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<WalletDTO>> getMyWallet() {
        WalletDTO wallet = walletService.getMyWallet();
        return ResponseEntity.ok(
                ApiResponse.success("Wallet retrieved", wallet)
        );
    }

    @PostMapping("/recharge")
    public ResponseEntity<ApiResponse<WalletDTO>> rechargeWallet(
            @Valid @RequestBody RechargeWalletRequest request) {

        log.info("Wallet recharge request: {}", request.getAmount());
        WalletDTO wallet = walletService.rechargeWallet(request);

        return ResponseEntity.ok(
                ApiResponse.success("Wallet recharged successfully", wallet)
        );
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse<List<TransactionDTO>>> getMyTransactions() {
        List<TransactionDTO> transactions = walletService.getMyTransactions();
        return ResponseEntity.ok(
                ApiResponse.success("Transactions retrieved", transactions)
        );
    }

    @GetMapping("/transactions/paginated")
    public ResponseEntity<ApiResponse<PageResponse<TransactionDTO>>> getMyTransactionsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        Sort.Direction direction =
                sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        PageResponse<TransactionDTO> transactions =
                walletService.getMyTransactionsPaginated(pageable);

        return ResponseEntity.ok(
                ApiResponse.success("Transactions retrieved", transactions)
        );
    }
}
