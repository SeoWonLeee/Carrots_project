package com.carrotzmarket.api.domain.chat.controller;

import com.carrotzmarket.api.common.annotation.Login;
import com.carrotzmarket.api.domain.chat.dto.ChatMessageDTO;
import com.carrotzmarket.api.domain.chat.dto.ChatRoomDto;
import com.carrotzmarket.api.domain.chat.repository.ChatMessageRepository;
import com.carrotzmarket.api.domain.chat.repository.ChatRoomRepository;
import com.carrotzmarket.api.domain.chat.service.ChatRoomService;
import com.carrotzmarket.api.domain.chat.service.ChatService;
import com.carrotzmarket.api.domain.product.dto.ProductResponseDto;
import com.carrotzmarket.api.domain.product.service.ProductService;
import com.carrotzmarket.api.domain.user.dto.response.UserSession;
import com.carrotzmarket.api.domain.user.service.UserManagementService;
import com.carrotzmarket.db.chat.ChatMessage;
import com.carrotzmarket.db.chat.ChatRoomEntity;
import com.carrotzmarket.db.chat.RoomUserEntity;
import com.carrotzmarket.db.product.ProductEntity;
import com.carrotzmarket.db.user.UserEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/talk")
public class ChatAPIController {

    private final ChatMessageRepository chatMessageRepository;
    private final UserManagementService userManagementService;
    private final ChatService chatService;
    private final ProductService productService;
    private final ChatRoomService chatRoomService;

    @PostMapping
    public ResponseEntity<Object> chatRequest(@Login UserSession userSession, Long productId) {

        if (userSession == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        ProductResponseDto productResponse = productService.getProductById(productId);
        UserEntity buyer = userManagementService.findUserEntityByUserId(userSession.getId());
        UserEntity seller = userManagementService.findUserEntityByUserId(productResponse.getUserId());

        ChatRoomEntity existingChatRoom  = chatService.findChatRoomByProductAndUsers(productId, buyer.getId());
        if (existingChatRoom  != null) {
            log.info("기존 채팅방 반환");
            ChatRoomDto chatRoomDto = new ChatRoomDto(
                    existingChatRoom.getId(),
                    existingChatRoom.getProduct().getId(),
                    existingChatRoom.getProduct().getTitle(),
                    seller.getLoginId(),
                    seller.getProfileImageUrl(),
                    existingChatRoom.getMessages().isEmpty() ? "" : existingChatRoom.getMessages().get(existingChatRoom.getMessages().size() - 1).getMessage(),
                    "hi",null,0
            );
            return ResponseEntity.ok(chatRoomDto);
        }

        ChatRoomEntity chatRoomEntity = new ChatRoomEntity();
        chatRoomEntity.setProduct(productService.findProductById(productId));
        chatRoomEntity.setSeller(seller);
        chatRoomEntity.setBuyer(buyer);

        ChatRoomEntity chatRoom = chatService.createChatRoom(chatRoomEntity);
        RoomUserEntity buyerRoomUser = new RoomUserEntity();
        buyerRoomUser.setChatRoom(chatRoom);
        buyerRoomUser.setUser(buyer);

        RoomUserEntity sellerRoomUser = new RoomUserEntity();
        sellerRoomUser.setChatRoom(chatRoom);
        sellerRoomUser.setUser(seller);

        chatRoomService.save(buyerRoomUser);
        chatRoomService.save(sellerRoomUser);

        ChatRoomDto chatRoomDto = new ChatRoomDto(
                chatRoom.getId(),
                chatRoom.getProduct().getId(),
                chatRoom.getProduct().getTitle(),
                seller.getLoginId(),
                seller.getProfileImageUrl(),
                chatRoom.getMessages().isEmpty() ? "" : chatRoom.getMessages().get(chatRoom.getMessages().size() - 1).getMessage(),
                "hi",null,0
        );

        return ResponseEntity.ok(chatRoomDto);
    }

    @GetMapping
    public ResponseEntity<List<ChatRoomDto>> viewAllChatRooms(@Login UserSession userSession) {

        if (userSession == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<RoomUserEntity> results = chatRoomService.viewAllChatRoomsByUserID(userSession.getId());

        List<ChatRoomDto> answer = new ArrayList<>();
        for (RoomUserEntity roomUser : results) {
            ChatRoomEntity chatRoom = roomUser.getChatRoom();
            UserEntity partner = chatRoom.getSeller().getId().equals(userSession.getId())
                    ? chatRoom.getBuyer()
                    : chatRoom.getSeller();

            answer.add(new ChatRoomDto(
                    chatRoom.getId(),
                    chatRoom.getProduct().getId(),
                    chatRoom.getProduct().getTitle(),
                    partner.getLoginId(),
                    partner.getProfileImageUrl(),
                    chatRoom.getMessages().isEmpty() ? "" : chatRoom.getMessages().get(chatRoom.getMessages().size() - 1).getMessage(),
                    "hi",null,0
            ));
        }
        return ResponseEntity.ok(answer);
    }

    @GetMapping("/{roomId}")
    public List<ChatMessageDTO> getChatHistory(@PathVariable("roomId") Long roomId) {
        log.info("채팅 내역 요청 - roomId: {}", roomId);
        List<ChatMessage> chatMessages = chatMessageRepository.findByRoomIdOrderByTimestamp(roomId);
        return chatMessages.stream()
                .map(msg -> new ChatMessageDTO(
                        msg.getId(),
                        msg.getSender(),
                        msg.getReceiver(),
                        msg.getMessage(),
                        msg.getTimestamp()
                ))
                .collect(Collectors.toList());
    }

}
