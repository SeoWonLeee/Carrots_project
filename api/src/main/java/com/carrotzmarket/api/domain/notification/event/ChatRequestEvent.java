package com.carrotzmarket.api.domain.notification.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
public class ChatRequestEvent implements Serializable {
    private Long senderId;
    private Long receiverId;
    private Long roomId;
    private String message;
    private String productTitle;
}
