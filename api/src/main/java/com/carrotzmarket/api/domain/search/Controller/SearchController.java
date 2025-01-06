package com.carrotzmarket.api.domain.search.Controller;

import com.carrotzmarket.api.domain.search.domain.SearchFilters;
import com.carrotzmarket.api.domain.search.service.SearchProductResponse;
import com.carrotzmarket.api.domain.search.service.SearchService;
import com.carrotzmarket.db.product.ProductEntity;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/buy-sell")
public class SearchController {

    private final SearchService searchService;

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        binder.setAllowedFields("search", "region", "category_id", "sort_by", "price", "on_sale");
    }

    @GetMapping("/")
    public ResponseEntity<List<SearchProductResponse>> searchProduct(@ModelAttribute SearchFilters searchFilters) {
        log.info("필터 정보 = {}", searchFilters.toString());
        List<SearchProductResponse> products = searchService.findProductsWithFilterApplied(searchFilters);
        return ResponseEntity.ok(products);
    }
}
