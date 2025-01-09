package com.carrotzmarket.api.domain.transaction.service;

import static com.carrotzmarket.api.common.error.TransactionErrorCode.DUPLICATE_TRANSACTION_STATUS_CHANGE;
import static com.carrotzmarket.api.common.error.TransactionErrorCode.ONLY_SELLER_CAN_CHANGE_STATUS;
import static com.carrotzmarket.api.common.error.TransactionErrorCode.TRANSACTION_NOT_FOUND;
import static com.carrotzmarket.db.product.ProductStatus.ON_SALE;
import static com.carrotzmarket.db.product.ProductStatus.SOLD_OUT;
import static com.carrotzmarket.db.transaction.TransactionStatus.CANCELED;
import static com.carrotzmarket.db.transaction.TransactionStatus.COMPLETED;
import static com.carrotzmarket.db.transaction.TransactionStatus.IN_PROGRESS;
import static com.carrotzmarket.db.transaction.TransactionStatus.RESERVED;

import com.carrotzmarket.api.common.exception.ApiException;
import com.carrotzmarket.api.domain.product.service.ProductService;
import com.carrotzmarket.api.domain.transaction.converter.ProductTransactionConverter;
import com.carrotzmarket.api.domain.transaction.dto.PurchaseRequest;
import com.carrotzmarket.api.domain.transaction.dto.ScheduleRequest;
import com.carrotzmarket.api.domain.transaction.dto.TransactionHistoryDto;
import com.carrotzmarket.api.domain.transaction.dto.TransactionStatusUpdateRequest;
import com.carrotzmarket.api.domain.transaction.repository.ProductTransactionRepository;
import com.carrotzmarket.db.product.ProductEntity;
import com.carrotzmarket.db.product.ProductStatus;
import com.carrotzmarket.db.transaction.ProductTransactionEntity;
import com.carrotzmarket.db.transaction.TransactionStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ProductTransactionService {

    private final ProductTransactionRepository repository;
    private final ProductTransactionConverter converter;
    private final ProductService productService;

    @Transactional(readOnly = false)
    public ProductTransactionEntity createTransaction(PurchaseRequest request) {
        ProductTransactionEntity entity = converter.toEntity(request);
        return repository.save(entity);
    }

    @Transactional(readOnly = false)
    public ProductTransactionEntity updateTransaction(TransactionStatusUpdateRequest request) {
        ProductEntity product = productService.findProductById(request.getProductId());
        validateSellerAuthorization(product, request.getAuthorId());
        ProductTransactionEntity transaction = repository.findTransactionByProductIdAndAuthorId(
                product.getId(), request.getAuthorId()).orElseThrow(() -> new ApiException(TRANSACTION_NOT_FOUND));
        changeTransactionStatus(transaction, product, request.getStatus());
        return transaction;
    }

    @Transactional(readOnly = true)
    public TransactionHistoryDto findTransactionDetailById(Long id) {
        ProductTransactionEntity transaction = repository.findTransactionDetailById(id)
                .orElseThrow(() -> new ApiException(TRANSACTION_NOT_FOUND, "Transaction not found with id: " + id));
        return convertToTransactionHistoryDto(transaction);
    }

    private TransactionHistoryDto convertToTransactionHistoryDto(ProductTransactionEntity transaction) {
        TransactionHistoryDto dto = new TransactionHistoryDto();
        dto.setId(transaction.getId());
        dto.setTitle(transaction.getProduct().getTitle());
        dto.setPrice(transaction.getProduct().getPrice());
        dto.setTransactionDate(transaction.getTransactionDate());
        dto.setTradingPlace(transaction.getTradingPlace());
        dto.setBuyerId(transaction.getBuyerId());
        dto.setSellerId(transaction.getSellerId());
        dto.setStatus(transaction.getStatus().name());
        return dto;
    }

    public List<TransactionHistoryDto> findAllPurchaseHistory(Long userId) {
        List<ProductTransactionEntity> transactions = repository.findAllPurchaseHistoryByUserId(userId);
        return transactions.stream().map(this::convertToTransactionHistoryDto).toList();
    }

    public List<TransactionHistoryDto> findAllSalesHistory(Long userId) {
        List<ProductTransactionEntity> transactions = repository.findAllSalesHistoryByUserId(userId);
        return transactions.stream().map(this::convertToTransactionHistoryDto).toList();
    }

    private void changeTransactionStatus(ProductTransactionEntity entity, ProductEntity product, TransactionStatus status) {
        if (entity.getStatus().equals(status)) {
            throw new ApiException(DUPLICATE_TRANSACTION_STATUS_CHANGE);
        }

        if (status.equals(RESERVED)) {
            product.setStatus(ProductStatus.RESERVED);
            entity.setStatus(RESERVED);
        }

        if (status.equals(COMPLETED)) {
            product.setStatus(SOLD_OUT);
            entity.setStatus(COMPLETED);
        }

        if (status.equals(IN_PROGRESS)) {
            product.setStatus(ON_SALE);
            entity.setStatus(IN_PROGRESS);
        }

        if (status.equals(CANCELED)) {
            product.setStatus(ON_SALE);
            entity.setStatus(CANCELED);
        }
    }

    @Transactional
    public void saveSchedule(ScheduleRequest request) {
        ProductTransactionEntity transaction = new ProductTransactionEntity();

        // LocalDate와 LocalTime을 결합하여 LocalDateTime 생성
        LocalDate transactionDate = request.getDate(); // LocalDate
        LocalTime transactionTime = LocalTime.parse(request.getTime(), DateTimeFormatter.ofPattern("HH:mm")); // LocalTime
        LocalDateTime tradingHours = LocalDateTime.of(transactionDate, transactionTime); // LocalDateTime 생성

        transaction.setTransactionDate(transactionDate);
        transaction.setTradingHours(tradingHours); // LocalDateTime으로 설정
        transaction.setTradingPlace(request.getPlace());

        repository.save(transaction); // 데이터베이스에 저장
    }







    private void validateSellerAuthorization(ProductEntity product, Long authorId) {
        if (!product.getUserId().equals(authorId)) {
            throw new ApiException(ONLY_SELLER_CAN_CHANGE_STATUS);
        }
    }

    @Transactional(readOnly = false)
    public ProductTransactionEntity updateTransactionDetails(TransactionStatusUpdateRequest request) {
        ProductEntity product = productService.findProductById(request.getProductId());
        validateSellerAuthorization(product, request.getAuthorId());

        ProductTransactionEntity transaction = repository.findTransactionByProductIdAndSellerId(
                        request.getProductId(), request.getAuthorId())
                .orElseThrow(() -> new ApiException(TRANSACTION_NOT_FOUND));

        // 거래 정보 업데이트
        LocalDate date = request.getTransactionDate();
        LocalTime time = LocalTime.parse(request.getTime(), DateTimeFormatter.ofPattern("HH:mm"));
        LocalDateTime tradingHours = LocalDateTime.of(date, time);

        transaction.setTransactionDate(date);
        transaction.setTradingHours(tradingHours);
        transaction.setStatus(request.getStatus());

        updateProductStatus(transaction, product);

        return repository.save(transaction); // 수정된 트랜잭션 반환
    }





    private void updateProductStatus(ProductTransactionEntity transaction, ProductEntity product) {
        if (transaction.getStatus() == TransactionStatus.RESERVED) {
            product.setStatus(ProductStatus.RESERVED);
        } else if (transaction.getStatus() == TransactionStatus.COMPLETED) {
            product.setStatus(ProductStatus.SOLD_OUT);
        } else if (transaction.getStatus() == TransactionStatus.CANCELED) {
            product.setStatus(ProductStatus.ON_SALE);
        }
    }

    public TransactionHistoryDto findTransactionDetailByIdForUpdate(Long id) {
        ProductTransactionEntity transaction = repository.findTransactionDetailById(id)
                .orElseThrow(() -> new ApiException(TRANSACTION_NOT_FOUND));
        return convertToTransactionHistoryDto(transaction);
    }
}
