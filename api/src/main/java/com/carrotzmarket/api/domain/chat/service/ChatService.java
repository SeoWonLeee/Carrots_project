package com.carrotzmarket.api.domain.chat.service;

import com.carrotzmarket.api.domain.chat.repository.ChatRoomRepository;
import com.carrotzmarket.db.chat.ChatRoomEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;

    public ChatRoomEntity createChatRoom(ChatRoomEntity chatRoom) {
        return chatRoomRepository.createChatRoom(chatRoom);
    }

    public ChatRoomEntity findById(Long id) {
        return chatRoomRepository.findbyId(id);
    }

    public ChatRoomEntity findChatRoomByProductAndUsers(Long productId, Long userId) {
        return chatRoomRepository.findByProductIdAndUserId(productId, userId);
    }
}
