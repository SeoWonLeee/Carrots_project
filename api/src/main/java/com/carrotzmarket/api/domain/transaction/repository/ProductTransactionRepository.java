package com.carrotzmarket.api.domain.transaction.repository;

import com.carrotzmarket.db.product.ProductEntity;
import com.carrotzmarket.db.transaction.ProductTransactionEntity;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ProductTransactionRepository {

    private final EntityManager em;


    public ProductTransactionEntity save(ProductTransactionEntity productTransaction) {
        em.persist(productTransaction);
        return productTransaction;
    }

    public Optional<ProductTransactionEntity> findTransactionByProductIdAndAuthorId(Long productId, Long authorId) {
        return em.createQuery("SELECT P FROM ProductTransactionEntity P WHERE P.sellerId = :authorId AND P.product.id = :productId", ProductTransactionEntity.class)
                .setParameter("authorId", authorId)
                .setParameter("productId", productId)
                .getResultStream().findFirst();
    }

    public List<ProductTransactionEntity> findAllPurchaseHistoryByUserId(Long id) {
        return em.createQuery("SELECT P FROM ProductTransactionEntity P WHERE P.buyerId = :id AND P.status = 'COMPLETED'", ProductTransactionEntity.class)
                .setParameter("id", id)
                .getResultList();
    }

    public List<ProductTransactionEntity> findAllSalesHistoryByUserId(Long id) {
        return em.createQuery("SELECT P FROM ProductTransactionEntity P WHERE P.sellerId = :id AND P.status = 'COMPLETED'", ProductTransactionEntity.class)
                .setParameter("id", id)
                .getResultList();
    }

    public Optional<ProductTransactionEntity> findTransactionDetailById(Long id) {
        return em.createQuery(
                        "SELECT t FROM ProductTransactionEntity t " +
                                "JOIN FETCH t.product p " +
                                "WHERE t.id = :id", ProductTransactionEntity.class)
                .setParameter("id", id)
                .getResultStream().findFirst();
    }

    public Optional<ProductTransactionEntity> findTransactionByProductIdAndSellerId(Long productId, Long sellerId) {
        return em.createQuery(
                        "SELECT t FROM ProductTransactionEntity t WHERE t.product.id = :productId AND t.sellerId = :sellerId",
                        ProductTransactionEntity.class)
                .setParameter("productId", productId)
                .setParameter("sellerId", sellerId)
                .getResultStream()
                .findFirst();
    }

}
