package com.carrotzmarket.api.domain.product.service;

import com.carrotzmarket.db.product.ProductEntity;
import com.carrotzmarket.api.domain.product.repository.ProductRepository;
import com.carrotzmarket.api.domain.productImage.service.ProductImageService;
import com.carrotzmarket.api.domain.viewedProduct.service.ViewedProductService;
import com.carrotzmarket.api.domain.product.dto.ProductResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FilterService {

    private final ProductRepository productRepository;
    private final ProductImageService productImageService;
    private final ViewedProductService viewedProductService;
    private final ProductService productService;

    public List<ProductEntity> filterProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<ProductEntity> filterProductsByRegion(Long regionId) {
        return productRepository.findByRegionId(regionId);
    }

    public List<ProductEntity> filterProductsByCategoryName(String categoryName) {
        return productRepository.findByCategoryNameContaining(categoryName);
    }

    public List<ProductEntity> sortProducts(String sortBy) {
        switch (sortBy) {
            case "등록순":
                return productRepository.findAllByOrderByCreatedAtDesc();
            case "업데이트순":
                return productRepository.findAllByOrderByUpdatedAtDesc();
            default:
                throw new IllegalArgumentException("Invalid sort option: " + sortBy);
        }
    }

    public List<ProductEntity> filterProductsByPriceRange(int minPrice, int maxPrice) {
        return productRepository.findByPriceBetween(minPrice, maxPrice)
                .stream()
                .sorted(Comparator.comparing(ProductEntity::getCreatedAt).reversed())
                .collect(Collectors.toList());
    }

    public List<ProductEntity> filterProductsByFixedMaxPrice(int maxPrice) {
        return productRepository.findByPriceBetween(0, maxPrice);
    }

    public List<ProductResponseDto> getSearchResults(Long userId, String title) {
        List<ProductEntity> products = productRepository.findByTitleContaining(title);

        Set<Long> viewedProductIds = viewedProductService.getViewedProductIds(userId);

        return products.stream()
                .map(product -> new ProductResponseDto(
                        product,
                        productImageService.getProductImageByProductId(product.getId()).stream()
                                .map(image -> image.getImageUrl())
                                .collect(Collectors.toList()),
                        viewedProductIds.contains(product.getId())
                ))
                .collect(Collectors.toList());
    }
}
