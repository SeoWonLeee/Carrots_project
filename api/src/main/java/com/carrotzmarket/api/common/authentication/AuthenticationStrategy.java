package com.carrotzmarket.api.common.authentication;

import com.carrotzmarket.api.common.api.ResponseInterface;
import com.carrotzmarket.db.user.UserEntity;

public interface AuthenticationStrategy {
    ResponseInterface authenticate(UserEntity userEntity, String input);
}
