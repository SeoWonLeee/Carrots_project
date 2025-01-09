package com.carrotzmarket.api.domain.transaction.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PurchaseRequest {

    @NotNull(message = "상품 ID는 필수입니다.")
    private Long productId;

    @NotNull(message = "구매자 ID는 필수입니다.")
    private Long buyerId;

    @NotNull(message = "판매자 ID는 필수입니다.")
    private Long sellerId;

    @NotNull(message = "거래 날짜는 필수입니다.")
    private LocalDate transactionDate;

    @NotNull(message = "거래 시간은 필수입니다.")
    private LocalDateTime tradingHours;

    @NotBlank(message = "거래 장소는 필수입니다.")
    private String tradingPlace;
}
