package com.carrotzmarket.api.domain.notification.service;

import ch.rasc.sse.eventbus.SseEventBus;
import ch.rasc.sse.eventbus.SseEvent;
import com.carrotzmarket.api.domain.notification.event.ProductSoldEvent;
import com.carrotzmarket.api.domain.notification.event.ChatRequestEvent;
import com.carrotzmarket.api.domain.notification.repository.NotificationRepository;
import com.carrotzmarket.db.notification.NotificationEntity;
import com.carrotzmarket.db.notification.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SseEventBus eventBus;
    private final NotificationRepository notificationRepository;

    public String sendProductSoldNotification(Long userId, Long productId, String productName) {
        ProductSoldEvent productSoldEvent = new ProductSoldEvent(userId, productId, productName);

        SseEvent event = SseEvent.ofData(productSoldEvent);

        eventBus.handleEvent(event);

        String message = "상품 '" + productName + "'이(가) 판매되었습니다.";
        String targetUrl = "/products/" + productId;
        NotificationEntity notification = new NotificationEntity(userId, NotificationType.PRODUCT_SOLD, message, targetUrl);
        notificationRepository.save(notification);

        return "상품 판매 알림이 저장되었습니다.";
    }

    public String sendChatRequestNotification(Long senderId, Long receiverId, Long roomId, String message, String productTitle) {
        ChatRequestEvent chatRequestEvent = new ChatRequestEvent(senderId, receiverId, roomId, message, productTitle);

        SseEvent event = SseEvent.ofData(chatRequestEvent);

        eventBus.handleEvent(event);

        String notificationMessage = "새로운 채팅 요청: " + message;
        String targetUrl = "/chat/rooms/" + roomId;
        NotificationEntity notification = new NotificationEntity(receiverId, NotificationType.CHAT_REQUEST, notificationMessage, targetUrl);
        notificationRepository.save(notification);

        return "채팅 요청 알림이 저장되었습니다.";
    }

    public Map<String, Object> getNotificationsByUserId(Long userId) {
        List<NotificationEntity> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return Map.of(
                "message", userId + "의 모든 알림이 조회되었습니다.",
                "data", notifications
        );
    }

    public Map<String, Object> getUnreadNotificationsByUserId(Long userId) {
        List<NotificationEntity> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        return Map.of(
                "message", "읽지 않은 알림이 조회되었습니다.",
                "data", unreadNotifications
        );
    }

    public String markNotificationAsRead(Long notificationId) {
        NotificationEntity notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
        return "알림이 읽음 처리되었습니다.";
    }

    public String markAllNotificationsAsRead(Long userId) {
        List<NotificationEntity> notifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        for (NotificationEntity notification : notifications) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(notifications);
        return userId + "의 모든 알림이 읽음 처리되었습니다.";
    }
}