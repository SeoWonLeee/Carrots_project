package com.carrotzmarket.api.domain.image.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class Image {
    public static final String DEFAULT_IMAGE = "default_image.jpg";
    private String originalFileName;
    private String storeFileName;
}
