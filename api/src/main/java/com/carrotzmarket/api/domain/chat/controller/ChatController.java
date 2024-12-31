package com.carrotzmarket.api.domain.chat.controller;

import com.carrotzmarket.api.domain.chat.dto.ChatMessageDTO;
import com.carrotzmarket.api.domain.chat.repository.ChatMessageRepository;
import com.carrotzmarket.api.domain.chat.repository.ChatRoomRepository;
import com.carrotzmarket.api.domain.chat.service.ChatService;
import com.carrotzmarket.api.domain.user.service.UserManagementService;
import com.carrotzmarket.db.chat.ChatMessage;
import com.carrotzmarket.db.chat.ChatRoomEntity;
import com.carrotzmarket.db.user.UserEntity;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
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
    public void sendMessage(@DestinationVariable("roomId") Long roomId, ChatMessageDTO messageDTO) {
        try {

            ChatRoomEntity chatRoom = chatService.findById(roomId);
            UserEntity sender = chatRoom.getBuyer();
            UserEntity receiver = chatRoom.getSeller();

            log.info("보낸이 {}", sender.getLoginId());
            log.info("받는이 {}", sender.getLoginId());

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setSender(sender.getLoginId());
            chatMessage.setReceiver(receiver.getLoginId());
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
