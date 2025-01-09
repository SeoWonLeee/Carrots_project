package com.carrotzmarket.api.common.authentication;

import static com.carrotzmarket.api.common.status.UserResponseStatus.FAILURE;
import static com.carrotzmarket.api.common.status.UserResponseStatus.LOCKED;

import com.carrotzmarket.api.common.api.ResponseInterface;
import com.carrotzmarket.api.common.status.UserResponseStatus;
import com.carrotzmarket.api.domain.user.dto.response.UserResponse;
import com.carrotzmarket.db.user.UserEntity;
import org.springframework.stereotype.Component;


@Component
public class PasswordAuthentication implements AuthenticationStrategy{

    public static final String LOGIN_SUCCESS = "로그인 성공";
    public static final String LOGIN_FAIL = "아이디 또는 비밀번호 오류";

    @Override
    public ResponseInterface authenticate(UserEntity userEntity, String input) {
        if (userEntity.isLoginLock()) {
            return createResponse(userEntity, LOCKED, "여러 번의 로그인 시도 실패로 인해 귀하의 계정이 잠겼습니다.");
        }

        if (!userEntity.getPassword().equals(input)) {
            userEntity.loginFail();
            return createResponse(userEntity, FAILURE, "비밀번호가 일치하지 않습니다.");
        }

        return null;
    }

    private ResponseInterface createResponse(UserEntity userEntity, UserResponseStatus status, String message) {
        return UserResponse.builder()
                .loginId(userEntity.getLoginId())
                .failedLoginAttemptsCount(userEntity.getFailedLoginAttempts())
                .nextLoginAttemptTime(userEntity.getLastFailedLoginAttempt())
                .status(status.name())
                .message(message)
                .build();
    }
}
