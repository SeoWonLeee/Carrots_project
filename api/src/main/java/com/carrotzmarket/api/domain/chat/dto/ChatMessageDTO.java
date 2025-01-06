package com.carrotzmarket.api.domain.chat.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ChatMessageDTO {

    private Long id;
    private String sender;
    private String message;
    private LocalDateTime timestamp;

    private String sellerId;
    private String productTitle;
    private int productPrice;
    private String sellerProfileURL;
    private String productImageURL;
    private String productStatus;
    private double sellerManner;

}
