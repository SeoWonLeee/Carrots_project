package com.carrotzmarket.api.domain.notification.controller;

import com.carrotzmarket.api.domain.notification.event.ProductSoldEvent;
import com.carrotzmarket.api.domain.notification.event.ChatRequestEvent;
import com.carrotzmarket.api.domain.notification.service.NotificationService;
import com.carrotzmarket.db.notification.NotificationEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import ch.rasc.sse.eventbus.SseEventBus;
import ch.rasc.sse.eventbus.SseEvent;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // 특정 사용자의 모든 알림 조회
    @GetMapping("/{userId}/all")
    public ResponseEntity<Map<String, Object>> getAllNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getNotificationsByUserId(userId));
    }

    // 특정 사용자의 읽지 않은 알림 조회
    @GetMapping("/{userId}/unread")
    public ResponseEntity<Map<String, Object>> getUnreadNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotificationsByUserId(userId));
    }

    // 상품 판매 알림 저장
    @PostMapping("/product-sold")
    public ResponseEntity<String> sendProductSoldNotification(
            @RequestParam Long userId,
            @RequestParam Long productId,
            @RequestParam String productName) {
        String result = notificationService.sendProductSoldNotification(userId, productId, productName);
        return ResponseEntity.ok(result);
    }

    // 채팅 요청 알림 저장
    @PostMapping("/chat-request")
    public ResponseEntity<String> sendChatRequestNotification(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam Long roomId,
            @RequestParam String message,
            @RequestParam String productTitle) {
        String result = notificationService.sendChatRequestNotification(senderId, receiverId, roomId, message, productTitle);
        return ResponseEntity.ok(result);
    }

    // 특정 알림 읽음 처리
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<String> markNotificationAsRead(@PathVariable Long notificationId) {
        String result = notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok(result);
    }

    // 해당 사용자의 모든 읽지 않은 알림을 읽음 처리
    @PatchMapping("/{userId}/read-all")
    public ResponseEntity<String> markAllNotificationsAsRead(@PathVariable Long userId) {
        String result = notificationService.markAllNotificationsAsRead(userId);
        return ResponseEntity.ok(result);
    }
}
