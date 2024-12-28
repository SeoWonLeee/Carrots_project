package com.carrotzmarket.api.domain.user.service;


import static com.carrotzmarket.api.common.status.UserResponseStatus.FAILURE;
import static com.carrotzmarket.api.common.status.UserResponseStatus.SUCCESS;

import com.carrotzmarket.api.common.api.ResponseInterface;
import com.carrotzmarket.api.common.error.UserErrorCode;
import com.carrotzmarket.api.common.exception.ApiException;
import com.carrotzmarket.api.common.status.UserResponseStatus;
import com.carrotzmarket.api.domain.image.domain.Image;
import com.carrotzmarket.api.domain.image.service.ProfileImageService;
import com.carrotzmarket.api.domain.region.service.RegionService;
import com.carrotzmarket.api.domain.user.converter.UserConverter;
import com.carrotzmarket.api.domain.user.dto.response.UserSession;
import com.carrotzmarket.api.domain.user.dto.response.UserResponse;
import com.carrotzmarket.api.domain.user.dto.request.UserUpdateRequest;
import com.carrotzmarket.api.domain.user.repository.UserRepository;
import com.carrotzmarket.db.region.RegionEntity;
import com.carrotzmarket.db.user.UserEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserManagementService {

    private final UserRepository userRepository;
    private final RegionService regionService;
    private final ProfileImageService profileImageService;
    private final UserConverter userConverter;

    public ResponseInterface getUserInfoByLoginId(String loginId) {
        try {
            UserEntity userEntity = findUserEntityByLoginId(loginId);
            return userConverter.toResponse(userEntity, SUCCESS, "회원 조회 성공");
        } catch (ApiException e) {
            return userConverter.toResponse(null, FAILURE, e.getMessage());
        }
    }

    public ResponseInterface update(UserSession userSession, UserUpdateRequest request, MultipartFile file) {
        UserEntity userEntity = findUserEntityByLoginId(userSession.getLoginId());

        Image uploadImage = profileImageService.uploadImage(file);
        RegionEntity region = regionService.getRegionById(request.getRegionId());

        userEntity.updateUser(
                request.getPassword(),
                request.getEmail(),
                request.getPhone(),
                region,
                uploadImage.getStoreFileName()
        );

        return userConverter.toResponse(userEntity, SUCCESS, "회원수정 성공");
    }

    public ResponseInterface deleteUser(String loginId) {
        UserEntity userEntity = findUserEntityByLoginId(loginId);
        userRepository.delete(userEntity);
        return UserResponse.builder().status("true").build();
    }

    public UserEntity findUserEntityByLoginId(String loginId) {
        return userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new ApiException(UserErrorCode.USER_NOT_FOUND));
    }
}
