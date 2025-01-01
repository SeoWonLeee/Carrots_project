package com.carrotzmarket.api.domain.chat.controller;

import com.carrotzmarket.api.domain.chat.dto.ChatMessageDTO;
import com.carrotzmarket.api.domain.chat.repository.ChatMessageRepository;
import com.carrotzmarket.api.domain.chat.repository.ChatRoomRepository;
import com.carrotzmarket.api.domain.chat.service.ChatService;
import com.carrotzmarket.api.domain.user.dto.response.UserSession;
import com.carrotzmarket.api.domain.user.service.UserManagementService;
import com.carrotzmarket.db.chat.ChatMessage;
import com.carrotzmarket.db.chat.ChatRoomEntity;
import com.carrotzmarket.db.user.UserEntity;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final UserManagementService userManagementService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;
    private final ChatService chatService;

    @MessageMapping("chat/{roomId}")
    public void sendMessage(@DestinationVariable("roomId") Long roomId, ChatMessageDTO messageDTO, SimpMessageHeaderAccessor headerAccessor) {
        try {

            Object userSessionObj = headerAccessor.getSessionAttributes().get("userSession");

            if (userSessionObj == null) {
                throw new RuntimeException("유저 세션 없음");
            }

            UserSession userSession = (UserSession) userSessionObj;
            String senderLoginId = userSession.getLoginId(); // UserSession 클래스에 getUsername() 메서드가 있다고 가정

            ChatRoomEntity chatRoom = chatService.findById(roomId);
            log.info("보낸이 {}", senderLoginId);

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setSender(senderLoginId);
            chatMessage.setMessage(messageDTO.getMessage());
            chatMessage.setTimestamp(LocalDateTime.now());
            chatMessage.setRoom(chatRoom);

            chatMessageRepository.save(chatMessage);

            messagingTemplate.convertAndSend(
                    "/topic/room/" + roomId, messageDTO
            );
        } catch (Exception e) {
            log.error("메시지 처리 중 오류 발생: ", e);
        }
    }
}
