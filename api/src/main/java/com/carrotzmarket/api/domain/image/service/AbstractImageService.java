package com.carrotzmarket.api.domain.image.service;

import static com.carrotzmarket.api.domain.image.domain.Image.DEFAULT_IMAGE;

import com.carrotzmarket.api.common.error.ErrorCode;
import com.carrotzmarket.api.common.exception.ApiException;
import com.carrotzmarket.api.domain.image.domain.Image;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

public abstract class AbstractImageService implements ImageServiceInterface {

    protected abstract String getBaseDirectory();

    @Override
    public String getFullPath(String fileName) {
        return getBaseDirectory() + fileName;
    }

    @Override
    public Image uploadImage(MultipartFile multipartFile) {
        if (multipartFile == null || multipartFile.isEmpty()) {
            return new Image(DEFAULT_IMAGE, DEFAULT_IMAGE);
        }

        String originalFileName = multipartFile.getOriginalFilename();
        String storeFileName = crateStoreFileName(originalFileName);

        try {
            multipartFile.transferTo(new File(getFullPath(storeFileName)));
        } catch (IOException e) {
            throw new ApiException(ErrorCode.BAD_REQUEST, "파일 저장중 오류 발생");
        }
        return new Image(originalFileName, storeFileName);
    }

    @Override
    public List<Image> uploadImages(List<MultipartFile> multipartFiles) {
        List<Image> uploadImages = new ArrayList<>();
        for (MultipartFile multipartFile : multipartFiles) {
            if (multipartFile != null) {
                uploadImages.add(uploadImage(multipartFile));
            }
        }
        return uploadImages;
    }

    private String crateStoreFileName(String originalFileName) {
        String ext = extractExt(originalFileName);
        return UUID.randomUUID() + "." + ext;
    }

    private String extractExt(String originalFileName) {
        int pos = originalFileName.indexOf(".");
        return originalFileName.substring(pos + 1);
    }
}
