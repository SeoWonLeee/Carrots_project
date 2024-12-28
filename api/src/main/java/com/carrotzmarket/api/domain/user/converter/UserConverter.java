package com.carrotzmarket.api.domain.user.converter;

import com.carrotzmarket.api.common.api.ResponseInterface;
import com.carrotzmarket.api.common.status.UserResponseStatus;
import com.carrotzmarket.api.domain.user.dto.response.UserSession;
import com.carrotzmarket.api.domain.user.dto.request.UserRegisterRequest;
import com.carrotzmarket.api.domain.user.dto.response.UserResponse;
import com.carrotzmarket.db.region.RegionEntity;
import com.carrotzmarket.db.user.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserConverter {

    public UserEntity toEntity(UserRegisterRequest request, RegionEntity region, String profileImageUrl) {
        UserEntity userEntity = new UserEntity();
        userEntity.setLoginId(request.getLoginId());
        userEntity.setPassword(request.getPassword());
        userEntity.setEmail(request.getEmail());
        userEntity.setPhone(request.getPhone());
        userEntity.setProfileImageUrl(profileImageUrl);
        userEntity.addRegion(region);
        return userEntity;
    }

    public UserSession toSession(UserResponse response) {
        return  UserSession.builder()
                .id(response.getId())
                .loginId(response.getLoginId())
                .profileImageUrl(response.getProfileImageUrl())
                .region(response.getRegion())
                .build();
    }

    public ResponseInterface toResponse(UserEntity userEntity, UserResponseStatus status, String message) {

        if (userEntity == null) {
            return UserResponse.builder()
                    .status(status.name())
                    .message(message)
                    .build();
        }

        return UserResponse.builder()
                .id(userEntity.getId())
                .loginId(userEntity.getLoginId())
                .email(userEntity.getEmail())
                .phone(userEntity.getPhone())
                .profileImageUrl(userEntity.getProfileImageUrl())
                .region(userEntity.getUserRegion())
                .createdAt(userEntity.getCreatedAt())
                .failedLoginAttemptsCount(userEntity.getFailedLoginAttempts())
                .status(status.name())
                .message(message)
                .build();
    }
}
