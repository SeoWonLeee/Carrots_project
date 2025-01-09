package com.carrotzmarket.api.domain.user.service;

import static com.carrotzmarket.api.common.status.UserResponseStatus.FAILURE;
import static com.carrotzmarket.api.common.status.UserResponseStatus.SUCCESS;
import static com.carrotzmarket.api.common.authentication.PasswordAuthentication.LOGIN_FAIL;
import static com.carrotzmarket.api.common.authentication.PasswordAuthentication.LOGIN_SUCCESS;

import com.carrotzmarket.api.common.api.ResponseInterface;
import com.carrotzmarket.api.common.exception.ApiException;
import com.carrotzmarket.api.domain.user.converter.UserConverter;
import com.carrotzmarket.api.common.authentication.AuthenticationStrategy;
import com.carrotzmarket.api.domain.user.dto.request.UserLoginRequest;
import com.carrotzmarket.db.user.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserLoginService {

    private final UserManagementService userManagementService;
    private final AuthenticationStrategy authenticationStrategy;
    private final UserConverter userConverter;

    public ResponseInterface login(UserLoginRequest request) {
        try {
            final UserEntity userEntity = userManagementService.findUserEntityByLoginId(request.getLoginId());
            final ResponseInterface authenticationFailure = authenticationStrategy.authenticate(userEntity,
                    request.getPassword());

            if (authenticationFailure != null) {
                return authenticationFailure;
            }

            userEntity.loginSuccess();
            return buildSuccessResponse(userEntity);

        } catch (ApiException e) {
            return buildFailureResponse();
        }
    }

    private ResponseInterface buildSuccessResponse(UserEntity user) {
        return userConverter.toResponse(user, SUCCESS, LOGIN_SUCCESS);
    }

    private ResponseInterface buildFailureResponse() {
        return userConverter.toResponse(null, FAILURE, LOGIN_FAIL);
    }
}
