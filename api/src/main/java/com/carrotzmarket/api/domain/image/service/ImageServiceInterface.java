package com.carrotzmarket.api.domain.image.service;

import com.carrotzmarket.api.domain.image.domain.Image;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface ImageServiceInterface {
    String getFullPath(String fileName);
    Image uploadImage(MultipartFile multipartFile);
    List<Image> uploadImages(List<MultipartFile> multipartFiles);
}
