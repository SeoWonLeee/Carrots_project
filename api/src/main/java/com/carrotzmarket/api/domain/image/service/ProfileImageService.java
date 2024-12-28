package com.carrotzmarket.api.domain.image.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component("ProfileImageService")
public class ProfileImageService extends AbstractImageService{

    @Value("${file.upload.dir:/uploads/profile-images/}")
    private String profileImageDir;

    @Override
    protected String getBaseDirectory() {
        return profileImageDir;
    }
}
