package com.carrotzmarket.api.domain.notification.service;

import ch.rasc.sse.eventbus.SseEventBus;
import ch.rasc.sse.eventbus.SseEvent;
import com.carrotzmarket.api.domain.notification.event.ProductSoldEvent;
import com.carrotzmarket.api.domain.notification.event.ChatRequestEvent;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    private final SseEventBus eventBus;

    public NotificationService(SseEventBus eventBus) {
        this.eventBus = eventBus;
    }

    // 기존 상품 판매 알림
    public void sendProductSoldNotification(Long userId, Long productId, String productName) {
        ProductSoldEvent productSoldEvent = new ProductSoldEvent(userId, productId, productName);

        SseEvent event = SseEvent.ofData(productSoldEvent);

        eventBus.handleEvent(event);
    }

    // 채팅 요청 알림
    public void sendChatRequestNotification(Long senderId, Long receiverId, Long roomId, String message, String productTitle) {
        ChatRequestEvent chatRequestEvent = new ChatRequestEvent(senderId, receiverId, roomId, message, productTitle);

        SseEvent event = SseEvent.ofData(chatRequestEvent);

        eventBus.handleEvent(event);
    }
}
