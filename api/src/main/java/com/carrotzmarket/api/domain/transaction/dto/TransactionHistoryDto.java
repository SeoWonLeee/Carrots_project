package com.carrotzmarket.api.domain.transaction.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionHistoryDto {
    private Long id;
    private Long buyerId;
    private Long sellerId;
    private String title;
    private LocalDate transactionDate;
    private LocalDateTime tradingHours;
    private String status;
    private LocalDateTime statusChangeDate;
    private int price;
    private String tradingPlace;
}
