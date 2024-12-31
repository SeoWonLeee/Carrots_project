package com.carrotzmarket.api.domain.chat.repository;

import com.carrotzmarket.db.chat.RoomUserEntity;
import jakarta.persistence.EntityManager;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class RoomUserRepository {

    private final EntityManager em;

    public RoomUserEntity save(RoomUserEntity roomUser) {
        em.persist(roomUser);
        return roomUser;
    }

    public List<RoomUserEntity> findAllChatRoomsByUserId(Long userId) {
        return em.createQuery("SELECT R FROM RoomUserEntity R WHERE R.user.id = :userId", RoomUserEntity.class)
                .setParameter("userId", userId)
                .getResultList();
    }

}
