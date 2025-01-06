package com.carrotzmarket.api.domain.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ResponseCreateChat {
    private Long id;
    private Long productId;
    private String productName;
    private String productImageUrl;
    private String participantLoginId;
    private String productStatus;
}
