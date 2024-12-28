package com.carrotzmarket.api.domain.user;

import com.carrotzmarket.api.domain.user.dto.request.UserRegisterRequest;
import com.carrotzmarket.api.domain.user.dto.response.UserResponse;
import com.carrotzmarket.api.domain.user.repository.UserRepository;
import com.carrotzmarket.api.domain.user.service.UserRegistrationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@Transactional
public class UserServiceTest {

    @Autowired
    private UserRegistrationService userService;

    @Autowired
    private UserRepository userRepository;

    @Test
    void registerUserSuccessfully() {
        UserRegisterRequest request = new UserRegisterRequest(
                "testUser",
                "password123",
                "test@example.com",
                "010-1234-5678",
                LocalDate.of(1990, 1, 1),
                1L, null
        );

        UserResponse response = (UserResponse) userService.register(request);

        assertNotNull(response);
        assertEquals("testUser", response.getLoginId());
    }
}

