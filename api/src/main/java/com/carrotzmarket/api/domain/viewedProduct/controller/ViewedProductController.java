package com.carrotzmarket.api.domain.viewedProduct.controller;

import com.carrotzmarket.api.domain.viewedProduct.service.ViewedProductService;
import com.carrotzmarket.db.viewedProducts.ViewedProductEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/viewed-products")
@RequiredArgsConstructor
public class ViewedProductController {

    private final ViewedProductService viewedProductService;

    @PostMapping("/{userId}/{productId}")
    public ResponseEntity<String> recordViewedProduct(@PathVariable Long userId, @PathVariable Long productId) {
        viewedProductService.recordViewedProduct(userId, productId);
        return ResponseEntity.ok("본 제품이 성공적으로 기록되었습니다.");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Set<Long>> getViewedProductIds(@PathVariable Long userId) {
        Set<Long> viewedProductIds = viewedProductService.getViewedProductIds(userId);
        return ResponseEntity.ok(viewedProductIds);
    }
}
