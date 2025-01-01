package com.carrotzmarket.api.domain.chat.service;

import com.carrotzmarket.api.domain.chat.repository.RoomUserRepository;
import com.carrotzmarket.db.chat.ChatRoomEntity;
import com.carrotzmarket.db.chat.RoomUserEntity;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatRoomService {
    private final RoomUserRepository repository;

    public RoomUserEntity save(RoomUserEntity roomUser) {
        return repository.save(roomUser);
    }

    public List<RoomUserEntity> viewAllChatRoomsByUserID(Long userId) {
        return repository.findAllChatRoomsByUserId(userId);
    }
}
