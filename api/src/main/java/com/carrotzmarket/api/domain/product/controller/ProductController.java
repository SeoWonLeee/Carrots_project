package com.carrotzmarket.api.domain.product.controller;

import com.carrotzmarket.api.domain.product.dto.ProductCreateRequestDto;
import com.carrotzmarket.api.domain.product.dto.ProductResponseDto;
import com.carrotzmarket.api.domain.product.dto.ProductUpdateRequestDto;
import com.carrotzmarket.api.domain.product.repository.ProductRepository;
import com.carrotzmarket.api.domain.product.service.FilterService;
import com.carrotzmarket.api.domain.product.service.ProductService;
import com.carrotzmarket.api.domain.productImage.service.ProductImageService;
import com.carrotzmarket.api.domain.user.dto.response.UserSession;
import com.carrotzmarket.api.domain.user.service.UserMannerService;
import com.carrotzmarket.db.product.ProductEntity;
import com.carrotzmarket.db.product.ProductStatus;
import com.carrotzmarket.db.productImage.ProductImageEntity;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/products")
@Slf4j
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;
    private final UserMannerService userService;
    private final FilterService filterService;
    private final ProductImageService imageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> createProduct(@ModelAttribute ProductCreateRequestDto productCreateRequestDto, HttpServletRequest request) {

        HttpSession session = request.getSession();
        UserSession userSession = (UserSession) session.getAttribute("userSession");
        log.info("유저 정보 : {}", userSession.getLoginId());
        log.info("상품 정보 {}", productCreateRequestDto);

        productCreateRequestDto.setUserId(userSession.getId());

        ProductEntity product = productService.createProduct(productCreateRequestDto);
        return ResponseEntity.ok("Product created with ID: " + product.getId());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long id) {
        ProductResponseDto response = productService.getProductById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}/seller-info")
    public ResponseEntity<Map<String, Object>> getSellerInfoAndOtherProducts(@PathVariable Long id) {
        Map<String, Object> result = productService.getSellerInfoAndOtherProducts(id);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}/manner-temperature")
    public ResponseEntity<Map<String, Object>> getSellerMannerTemperatureAndOtherProducts(@PathVariable Long id) {
        Map<String, Object> response = productService.getSellerMannerTemperature(id);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable Long id,
            @RequestBody @Valid ProductUpdateRequestDto updateRequest) {
        ProductResponseDto updatedProduct = productService.updateProduct(id, updateRequest);
        return ResponseEntity.ok(updatedProduct);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ProductResponseDto> updateProductStatus(
            @PathVariable Long id,
            @RequestParam ProductStatus status) {
        ProductResponseDto updatedProduct = productService.updateProductStatus(id, status);
        return ResponseEntity.ok(updatedProduct);
    }

    @PatchMapping("/{productId}/update-manner-temperature")
    public ResponseEntity<String> updateMannerTemperature(@PathVariable Long productId) {
        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));
        Long sellerId = product.getUserId();

        userService.updateMannerTemperature(sellerId);

        return ResponseEntity.ok("판매자의 매너 온도가 업데이트 되었습니다.");
    }

    @PostMapping("/{productId}/favorite")
    public String addFavoriteProduct(@RequestParam Long userId, @PathVariable Long productId) {
        try {
            return productService.addFavoriteProduct(userId, productId);
        } catch (IllegalArgumentException e) {
            return e.getMessage();
        }
    }

    @DeleteMapping("/{productId}/favorite")
    public ResponseEntity<String> removeFavoriteProduct(
            @RequestParam Long userId,
            @PathVariable Long productId) {
        String message = productService.removeFavoriteProduct(userId, productId);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProductResponseDto>> getProductByUserId(@PathVariable Long userId) {
        List<ProductEntity> products = productService.getProductByUserId(userId);
        List<ProductResponseDto> response = new ArrayList<>();
        for (ProductEntity product : products) {
            ProductResponseDto productResponseDto = new ProductResponseDto();

            List<ProductImageEntity> images = imageService.getProductImageByProductId(product.getId());
            String imageUrl = images.get(0).getImageUrl();
            productResponseDto.setImage(imageUrl);
            productResponseDto.setId(product.getId());
            productResponseDto.setPrice(product.getPrice());
            productResponseDto.setUserId(product.getUserId());
            productResponseDto.setTitle(product.getTitle());
            response.add(productResponseDto);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/favorites")
    public ResponseEntity<?> getFavoriteProducts(@PathVariable Long userId) {
        List<Object> favoriteProducts = productService.getFavoriteProductsByUserId(userId);

        if (favoriteProducts.size() == 1 && favoriteProducts.get(0) instanceof String) {
            return ResponseEntity.ok(Map.of("message", favoriteProducts.get(0)));
        }

        return ResponseEntity.ok(favoriteProducts);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok("해당 상품이 삭제되었습니다.");
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponseDto>> searchProductsByTitle(
            @RequestParam Long userId,
            @RequestParam String title) {
        List<ProductResponseDto> searchResults = filterService.getSearchResults(userId, title);
        return ResponseEntity.ok(searchResults);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ProductResponseDto>> filterProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long regionId,
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) Integer fixedMaxPrice,
            @RequestParam(required = false, defaultValue = "0") Integer minPrice,
            @RequestParam(required = false, defaultValue = "100000000") Integer maxPrice
    ) {
        List<ProductEntity> products;

        if (categoryId != null) {
            products = filterService.filterProductsByCategory(categoryId);
        } else if (regionId != null) {
            products = filterService.filterProductsByRegion(regionId);
        } else if (categoryName != null) {
            products = filterService.filterProductsByCategoryName(categoryName);
        } else if (fixedMaxPrice != null) {
            products = filterService.filterProductsByFixedMaxPrice(fixedMaxPrice);
        } else if (sortBy != null) {
            products = filterService.sortProducts(sortBy);
        } else {
            products = filterService.filterProductsByPriceRange(minPrice, maxPrice);
        }

        List<ProductResponseDto> response = new ArrayList<>();
        for (ProductEntity product : products) {
            ProductResponseDto productById = productService.getProductById(product.getId());
            ProductResponseDto dto = new ProductResponseDto(product);
            dto.setImageUrls(productById.getImageUrls());
            response.add(dto);
        }


        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<List<ProductEntity>> getProductsByStatus(@RequestParam ProductStatus status) {
        List<ProductEntity> products = productService.getProductByStatus(status);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/top")
    public ResponseEntity<List<ProductEntity>> getTop10Products() {
        List<ProductEntity> products = productService.getTop10Products();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/user/status")
    public List<ProductEntity> getProductByUserIdAndStatus(@RequestParam Long userId, @RequestParam ProductStatus status) {
        return productService.getProductByUserIdAndStatus(userId, status);
    }
}
