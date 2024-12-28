package com.carrotzmarket.api.domain.user.dto.response;

import com.carrotzmarket.api.common.api.ResponseInterface;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@JsonInclude(JsonInclude.Include.NON_NULL)
public abstract class AbstractUserResponse implements ResponseInterface {
    private Long id;
    private String loginId;
    private String profileImageUrl;
    private String region;
    private String status;
    private String message;
}
