package com.carrotzmarket.api.domain.search.service;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchProductResponse {
    private Long productId;
    private String title;
    private String productImageURL;
    private int price;
    private String region;
}
