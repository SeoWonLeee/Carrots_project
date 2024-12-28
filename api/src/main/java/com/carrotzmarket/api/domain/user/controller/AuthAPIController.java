package com.carrotzmarket.api.domain.user.controller;

import com.carrotzmarket.api.common.api.ResponseInterface;
import com.carrotzmarket.api.domain.user.converter.UserConverter;
import com.carrotzmarket.api.domain.user.dto.response.UserSession;
import com.carrotzmarket.api.domain.user.dto.request.UserLoginRequest;
import com.carrotzmarket.api.domain.user.dto.response.UserResponse;
import com.carrotzmarket.api.domain.user.service.UserLoginService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthAPIController {

    private final UserLoginService userLoginService;
    private final UserConverter userConverter;

    @PostMapping("/login")
    public ResponseEntity<ResponseInterface> login(@RequestBody UserLoginRequest request, HttpServletRequest servlet) {
        ResponseInterface response = userLoginService.login(request);

        UserResponse findUser = (UserResponse) userLoginService.login(request);
        UserSession userSession = userConverter.toSession(findUser);

        HttpSession session = servlet.getSession();
        session.setAttribute("userSession", userSession);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate();
        }

        return ResponseEntity.ok(Map.of("status", "success"));
    }
}
