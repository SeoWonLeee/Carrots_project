package com.carrotzmarket.api.domain.chat.repository;

import com.carrotzmarket.db.chat.ChatRoomEntity;
import jakarta.persistence.EntityManager;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ChatRoomRepository {

    private final EntityManager em;

    public ChatRoomEntity createChatRoom(ChatRoomEntity chatRoom) {
        em.persist(chatRoom);
        return chatRoom;
    }

    public List<ChatRoomEntity> findByUserId(Long userId) {
        return em.createQuery("SELECT C FROM ChatRoomEntity AS C WHERE user.id = :userId", ChatRoomEntity.class)
                .setParameter("userId", userId)
                .getResultList();
    }

    public ChatRoomEntity findByProductIdAndUserId(Long productId, Long userId) {
        return em.createQuery(
                        "SELECT c FROM ChatRoomEntity c WHERE c.product.id = :productId AND (c.buyer.id = :userId OR c.seller.id = :userId)",
                        ChatRoomEntity.class)
                .setParameter("productId", productId)
                .setParameter("userId", userId)
                .getResultStream()
                .findFirst()
                .orElse(null);
    }

    public ChatRoomEntity findbyId(Long id) {
        return em.find(ChatRoomEntity.class, id);
    }
}
