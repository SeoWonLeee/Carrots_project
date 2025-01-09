package com.carrotzmarket.api.domain.notification.controller;

import com.carrotzmarket.api.domain.notification.service.NotificationService;
import com.carrotzmarket.db.notification.NotificationEntity;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationRedirectController {

    private final NotificationService notificationService;

    @Operation(summary = "알림에서 대상 URL로 리다이렉트")
    @ApiResponses({
            @ApiResponse(responseCode = "302", description = "대상 URL로 리다이렉트 성공"),
            @ApiResponse(responseCode = "404", description = "알림을 찾을 수 없음"),
            @ApiResponse(responseCode = "403", description = "접근 권한이 없음"),
            @ApiResponse(responseCode = "400", description = "잘못된 URL")
    })
    @GetMapping("/{notificationId}/redirect")
    public ResponseEntity<Void> redirectToTargetUrl(@PathVariable Long notificationId) {
        NotificationEntity notification = notificationService.getNotificationById(notificationId);

        if (notification == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).header("Message", "알림을 찾을 수 없습니다.").build();
        }

        Long currentUserId = getCurrentUserId();
        if (!notification.getUserId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).header("Message", "이 알림에 대한 접근 권한이 없습니다.").build();
        }

        if (!notificationService.isValidTargetUrl(notification.getTargetUrl())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).header("Message", "잘못된 URL입니다.").build();
        }

        notificationService.markNotificationAsRead(notificationId);

        return ResponseEntity.status(HttpStatus.FOUND).header("Location", notification.getTargetUrl()).build();
    }

    private Long getCurrentUserId() {
        try {
            return Long.valueOf(SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString());
        } catch (Exception e) {
            throw new IllegalStateException("인증된 사용자 정보를 가져오는 데 실패했습니다.", e);
        }
    }
}
