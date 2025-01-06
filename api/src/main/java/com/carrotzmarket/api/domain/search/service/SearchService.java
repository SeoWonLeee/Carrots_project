package com.carrotzmarket.api.domain.search.service;

import com.carrotzmarket.api.domain.category.service.CategoryService;
import com.carrotzmarket.api.domain.product.repository.ProductRepository;
import com.carrotzmarket.api.domain.productImage.service.ProductImageService;
import com.carrotzmarket.api.domain.region.service.RegionService;
import com.carrotzmarket.api.domain.search.domain.SearchFilters;
import com.carrotzmarket.db.product.ProductEntity;
import com.carrotzmarket.db.product.ProductStatus;
import com.carrotzmarket.db.product.QProductEntity;
import com.carrotzmarket.db.productImage.ProductImageEntity;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Predicate;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class SearchService {

    private final ProductRepository productRepository;
    private final ProductImageService imageService;


    public List<SearchProductResponse> findProductsWithFilterApplied(SearchFilters searchFilters) {
        Predicate predicate = buildPredicate(searchFilters);

        List<ProductEntity> result = (List<ProductEntity>) productRepository.findAll(predicate);
        List<SearchProductResponse> answer = new ArrayList<>();
        for (ProductEntity product : result) {
            List<ProductImageEntity> productImageByProductId = imageService.getProductImageByProductId(product.getId());
            answer.add(SearchProductResponse.builder()
                    .productId(product.getId())
                    .title(product.getTitle())
                    .price(product.getPrice())
                    .region(product.getAddress().getAddress())
                    .productImageURL(productImageByProductId.get(0).getImageUrl())
                    .build());
        }

        return answer;
    }

    private Predicate buildPredicate(SearchFilters filters) {
        BooleanBuilder builder = new BooleanBuilder();
        QProductEntity product = QProductEntity.productEntity;

        if (filters.getSearch() != null && !filters.getSearch().trim().isEmpty()) {
            builder.and(product.title.containsIgnoreCase(filters.getSearch()));
        }

        log.info("log = {}", filters.getAddress());
        if (filters.getAddress() != null) {

            if(filters.getAddress().getVillage() != null) {
                builder.and(product.address.village.villageName.eq(filters.getAddress().getVillage()));
            }

            if(filters.getAddress().getTown() != null) {
                builder.and(product.address.town.townName.eq(filters.getAddress().getTown()));
            }

            if(filters.getAddress().getCity() != null) {
                builder.and(product.address.city.cityName.eq(filters.getAddress().getCity()));
            }

            if(filters.getAddress().getProvince() != null) {
                builder.and(product.address.province.provinceName.eq(filters.getAddress().getProvince()));
            }

        }

        if (filters.getCategoryId() != null) {
            builder.and(product.category.id.eq(Long.valueOf(filters.getCategoryId())));
        }

        if (filters.getMinPrice() != null && filters.getMaxPrice() != null) {
            builder.and(product.price.between(filters.getMinPrice(), filters.getMaxPrice()));
        }


        if (filters.getOnSale() == ProductStatus.ON_SALE) {
            builder.and(product.status.eq(ProductStatus.ON_SALE));
        }


        log.info("Generated SQL: {}", builder.toString());
        return builder;
    }

}
