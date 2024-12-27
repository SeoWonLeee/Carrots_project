package com.carrotzmarket.api.domain.user.controller;

import com.carrotzmarket.api.common.exception.ApiException;
import com.carrotzmarket.api.domain.user.dto.UserLoginRequestDto;
import com.carrotzmarket.api.domain.user.dto.UserRegisterRequestDto;
import com.carrotzmarket.api.domain.user.dto.UserResponseDto;
import com.carrotzmarket.api.domain.user.dto.UserSessionInfoDto;
import com.carrotzmarket.api.domain.user.service.UserService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/open-api/user")
@RequiredArgsConstructor
public class UserOpenApiController {

    private final UserService userService;

    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<UserResponseDto> register(
            @Parameter(description = "사용자 정보")
            @RequestPart("request") UserRegisterRequestDto request){
        UserResponseDto response = userService.register(request);
        return ResponseEntity.ok(response);
    }



    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(
            @Valid @RequestBody UserLoginRequestDto request, HttpServletRequest httpRequest) {

        try {
            UserResponseDto response = userService.login(request);

            HttpSession session = httpRequest.getSession();
            session.setAttribute("userSession", new UserSessionInfoDto(
                    response.getId(),
                    response.getLoginId(),
                    response.getEmail(),
                    response.getPhone(),
                    response.getProfileImageUrl(),
                    response.getRegion()
            ));

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "data", response
            ));
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "error",
                    "code", e.getErrorCodeInterface().getErrorCode(),
                    "message", e.getErrorDescription()
            ));
        }
    }


    @GetMapping("/session-status")
    public ResponseEntity<String> checkSessionStatus(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("userSession") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expired or not found");
        }
        return ResponseEntity.ok("세션 유지중");
    }
}