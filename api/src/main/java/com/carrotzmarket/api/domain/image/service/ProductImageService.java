package com.carrotzmarket.api.domain.image.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component("ProductImageService")
public class ProductImageService extends AbstractImageService {

    @Value("${file.upload.dir:/uploads/product-images}")
    private String productImageDir;

    @Override
    protected String getBaseDirectory() {
        return productImageDir;
    }
}
