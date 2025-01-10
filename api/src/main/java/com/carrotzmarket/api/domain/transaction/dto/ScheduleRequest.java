package com.carrotzmarket.api.domain.transaction.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ScheduleRequest {

    @NotNull(message = "상품 ID는 필수입니다.")
    private Long productId;

    @NotNull(message = "판매자 ID는 필수입니다.")
    private Long sellerId;

    @NotNull(message = "거래 날짜는 필수입니다.")
    private LocalDate date;

    @NotNull(message = "거래 시간은 필수입니다.")
    private String time;

    @NotBlank(message = "거래 장소는 필수입니다.")
    private String place;
}
