package com.carrotzmarket.api.domain.user.service;

import static com.carrotzmarket.api.common.status.UserResponseStatus.SUCCESS;

import com.carrotzmarket.api.common.api.ResponseInterface;
import com.carrotzmarket.api.common.error.UserErrorCode;
import com.carrotzmarket.api.common.exception.ApiException;
import com.carrotzmarket.api.domain.image.domain.Image;
import com.carrotzmarket.api.domain.image.service.ProfileImageService;
import com.carrotzmarket.api.domain.region.service.RegionService;
import com.carrotzmarket.api.domain.user.converter.UserConverter;
import com.carrotzmarket.api.domain.user.dto.request.UserRegisterRequest;
import com.carrotzmarket.api.domain.user.repository.UserRepository;
import com.carrotzmarket.db.region.RegionEntity;
import com.carrotzmarket.db.user.UserEntity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserRegistrationService {

    private final UserRepository userRepository;
    private final RegionService regionService;
    private final ProfileImageService profileImageService;
    private final UserConverter userConverter;

    public ResponseInterface register(UserRegisterRequest request) {
        validateDuplicateLoginId(request.getLoginId());

        RegionEntity regionEntity = regionService.getRegionById(request.getRegionId());
        Image profileImage = profileImageService.uploadImage(request.getProfileImage());

        UserEntity userEntity = userConverter.toEntity(request, regionEntity, profileImage.getStoreFileName());
        userRepository.save(userEntity);

        return userConverter.toResponse(userEntity, SUCCESS, "회원가입 성공");
    }

    private void validateDuplicateLoginId(String loginId) {
        if (userRepository.findByLoginId(loginId).isPresent()) {
            throw new ApiException(UserErrorCode.USER_ALREADY_EXIST, "이미 존재하는 아이디 입니다.");
        }
    }
}
