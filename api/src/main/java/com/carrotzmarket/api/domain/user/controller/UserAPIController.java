package com.carrotzmarket.api.domain.user.controller;

import com.carrotzmarket.api.common.annotation.Login;
import com.carrotzmarket.api.common.api.ResponseInterface;
import com.carrotzmarket.api.domain.user.dto.response.UserSession;
import com.carrotzmarket.api.domain.user.dto.request.UserRegisterRequest;
import com.carrotzmarket.api.domain.user.dto.response.UserResponse;
import com.carrotzmarket.api.domain.user.dto.request.UserUpdateRequest;
import com.carrotzmarket.api.domain.user.service.UserManagementService;
import com.carrotzmarket.api.domain.user.service.UserRegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/users")
@RequiredArgsConstructor
public class UserAPIController {

    private final UserManagementService userManagementService;
    private final UserRegistrationService userRegistrationService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ResponseInterface> registerUser(@ModelAttribute UserRegisterRequest request) {
        UserResponse response = (UserResponse) userRegistrationService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ResponseInterface> getCurrentUserInfo(@Login UserSession userSession) {
        if (userSession == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserResponse response = (UserResponse) userManagementService.getUserInfoByLoginId(userSession.getLoginId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{loginId}")
    public ResponseEntity<ResponseInterface> getUserInfoByLoginId(@PathVariable String loginId) {
        UserResponse response = (UserResponse) userManagementService.getUserInfoByLoginId(loginId);
        return ResponseEntity.ok(response);
    }

    @PutMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> updateUser(
            @Login UserSession userSession,
            @RequestPart("data") UserUpdateRequest request,
            @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {

        if (userSession == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserResponse response = (UserResponse) userManagementService.update(userSession, request, profileImage);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping
    public ResponseEntity<ResponseInterface> deleteUser(@Login UserSession userSession) {
        if (userSession == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        ResponseInterface response = userManagementService.deleteUser(userSession.getLoginId());
        return ResponseEntity.ok(response);
    }
}
