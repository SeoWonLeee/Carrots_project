package com.carrotzmarket.api.domain.chat.repository;

import com.carrotzmarket.db.chat.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.List;

@Component
@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderAndReceiverOrderByTimestamp(String sender, String receiver);
    List<ChatMessage> findByReceiverAndSenderOrderByTimestamp(String receiver, String sender);
    List<ChatMessage> findByRoomIdOrderByTimestamp(Long roomId);
}
