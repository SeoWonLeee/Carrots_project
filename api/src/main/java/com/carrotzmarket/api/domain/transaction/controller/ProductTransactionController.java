package com.carrotzmarket.api.domain.transaction.controller;

import com.carrotzmarket.api.domain.transaction.dto.PurchaseRequest;
import com.carrotzmarket.api.domain.transaction.dto.TransactionHistoryDto;
import com.carrotzmarket.api.domain.transaction.dto.TransactionStatusUpdateRequest;
import com.carrotzmarket.api.domain.transaction.service.ProductTransactionService;
import com.carrotzmarket.db.transaction.ProductTransactionEntity;
import java.util.List;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProductTransactionController {

    private final ProductTransactionService service;

    @PostMapping("/transaction")
    public ProductTransactionEntity createTransaction(@RequestBody PurchaseRequest request) {
        return service.createTransaction(request);
    }


    @GetMapping("/transaction/history/purchase/{userId}")
    public List<TransactionHistoryDto> getPurchaseHistory(@PathVariable Long userId) {
        return service.findAllPurchaseHistory(userId);
    }


    @GetMapping("/transaction/history/sales/{userId}")
    public List<TransactionHistoryDto> getSalesHistory(@PathVariable Long userId) {
        return service.findAllSalesHistory(userId);
    }


    @GetMapping("/transaction/detail/{id}")
    public TransactionHistoryDto getTransactionDetail(@PathVariable Long id) {
        return service.findTransactionDetailById(id);
    }


    @PutMapping("/transaction")
    public ProductTransactionEntity updateTransaction(@RequestBody TransactionStatusUpdateRequest request) {
        return service.updateTransaction(request);
    }


    @GetMapping("/transaction/detail/update/{id}")
    public TransactionHistoryDto getTransactionDetailForUpdate(@PathVariable Long id) {
        return service.findTransactionDetailByIdForUpdate(id);
    }


    @PutMapping("/transaction/update")
    public ProductTransactionEntity updateTransactionDetails(@Valid @RequestBody TransactionStatusUpdateRequest request) {
        return service.updateTransactionDetails(request);
    }

}
