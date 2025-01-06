package com.carrotzmarket.api.domain.notification.event;

import lombok.Getter;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
public class ProductSoldEvent implements Serializable {
    private Long userId;
    private Long productId;
    private String productName;

    public ProductSoldEvent(Long userId, Long productId, String productName) {
        this.userId = userId;
        this.productId = productId;
        this.productName = productName;
    }
}
