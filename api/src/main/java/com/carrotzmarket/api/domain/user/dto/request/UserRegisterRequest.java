package com.carrotzmarket.api.domain.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRegisterRequest {

    private String loginId;

    @NotBlank(message = "password 입력은 필수입니다.")
    private String password;

    @NotBlank(message = "E-mail 입력은 필수입니다.")
    @Email
    private String email;

    private String phone;

    private LocalDate birthday;

    @NotNull(message = "지역 ID 입력은 필수입니다.")
    private Long regionId;

    private MultipartFile profileImage;
}
