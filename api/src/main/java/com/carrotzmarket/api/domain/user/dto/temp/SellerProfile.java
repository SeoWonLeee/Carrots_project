package com.carrotzmarket.api.domain.user.dto.temp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SellerProfile {
    private Long userId;
    private String loginId;
    private String profileImageUrl;
}
