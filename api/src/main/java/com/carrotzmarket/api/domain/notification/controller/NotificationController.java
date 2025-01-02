package com.carrotzmarket.api.domain.notification.controller;

import com.carrotzmarket.api.domain.notification.event.ProductSoldEvent;
import com.carrotzmarket.api.domain.notification.event.ChatRequestEvent;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import ch.rasc.sse.eventbus.SseEventBus;
import ch.rasc.sse.eventbus.SseEvent;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationController {

    private final SseEventBus eventBus;

    public NotificationController(SseEventBus eventBus) {
        this.eventBus = eventBus;
    }

    @GetMapping("/sse-endpoint")
    public SseEmitter registerClient(@RequestParam String clientId) {
        SseEmitter emitter = new SseEmitter(180_000L);

        emitter.onTimeout(emitter::complete);

        eventBus.registerClient(clientId, emitter);
        eventBus.subscribe(clientId, SseEvent.DEFAULT_EVENT);

        return emitter;
    }

    @GetMapping("/send-notification/{userId}/{productId}")
    public String sendProductSoldNotification(@PathVariable Long userId, @PathVariable Long productId) {
        String productName = "상품이 팔렸습니다.";

        ProductSoldEvent event = new ProductSoldEvent(userId, productId, productName);
        eventBus.handleEvent(SseEvent.ofData(event));

        return "찜한 상품 알림이 보냈습니다.";
    }

    @GetMapping("/send-chat-notification/{senderId}/{receiverId}/{roomId}")
    public String sendChatRequestNotification(
            @PathVariable Long senderId,
            @PathVariable Long receiverId,
            @PathVariable Long roomId) {
        String productTitle = "관련 상품 제목";
        String message = "새로운 채팅 요청이 도착했습니다.";

        ChatRequestEvent event = new ChatRequestEvent(senderId, receiverId, roomId, message, productTitle);
        eventBus.handleEvent(SseEvent.ofData(event));

        return "채팅 요청 알림이 보냈습니다.";
    }
}
