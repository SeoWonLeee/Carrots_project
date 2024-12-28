package com.carrotzmarket.api.domain.user.dto.response;

import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class UserResponse extends AbstractUserResponse {
    private String email;
    private String phone;
    private String region;
    private LocalDateTime createdAt;
    private LocalDate birthday;
    private String status;
    private String message;

    private Integer failedLoginAttemptsCount;
    private LocalDateTime lastFailedLoginTime;
    private LocalDateTime nextLoginAttemptTime;
}
