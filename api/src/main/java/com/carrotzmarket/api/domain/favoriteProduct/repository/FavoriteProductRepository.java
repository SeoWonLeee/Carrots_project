package com.carrotzmarket.api.domain.favoriteProduct.repository;

import com.carrotzmarket.db.favoriteProduct.FavoriteProductEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteProductRepository extends JpaRepository<FavoriteProductEntity, Long> {

    Optional<FavoriteProductEntity> findByUserIdAndProductId(Long userId, Long productId);

    List<FavoriteProductEntity> findByUserId(Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM FavoriteProductEntity f WHERE f.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);
}
