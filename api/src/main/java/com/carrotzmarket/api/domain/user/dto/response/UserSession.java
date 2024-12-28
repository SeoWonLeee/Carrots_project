package com.carrotzmarket.api.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class UserSession {
    private Long id;
    private String loginId;
    private String profileImageUrl;
    private String region;
}
