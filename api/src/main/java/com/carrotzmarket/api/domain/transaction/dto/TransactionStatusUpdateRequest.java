package com.carrotzmarket.api.domain.transaction.dto;

import com.carrotzmarket.db.transaction.TransactionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransactionStatusUpdateRequest {
    private Long productId;
    private Long authorId;
    private LocalDate transactionDate;
    private LocalDateTime tradingHours;
    private TransactionStatus status;
    private String time;
    private String tradingPlace;
}
