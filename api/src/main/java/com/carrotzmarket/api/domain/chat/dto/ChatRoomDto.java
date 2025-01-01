package com.carrotzmarket.api.domain.chat.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatRoomDto {
    private Long chatRoomId;
    private Long productId;
    private String productTitle;
    private int productPrice;
    private String productImage;
    private String otherUserLoginId;
    private double otherManner;
    private String partnerProfileImage;
    private String lastMessage;
    private LocalDateTime lastMessageTime;
    private int unreadMessageCount;
    private String productStatus;
    private String productImageURL;
}
