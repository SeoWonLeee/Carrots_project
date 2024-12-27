package com.carrotzmarket.api.domain.user;

import com.carrotzmarket.api.domain.user.dto.UserLoginRequestDto;
import com.carrotzmarket.api.domain.user.dto.UserRegisterRequestDto;
import com.carrotzmarket.api.domain.user.service.UserService;
import com.carrotzmarket.db.user.UserEntity;
import com.carrotzmarket.api.domain.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class UserServiceLoginLockTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    private UserEntity testUser;

    @BeforeEach
    void setUp() {
        // 테스트용 유저 등록
        UserRegisterRequestDto registerRequest = new UserRegisterRequestDto(
                "testuser",
                "password123",
                "testuser@example.com",
                "010-1234-5678",
                null,
                1L // 지역 ID
        );

        testUser = userRepository.findByLoginId(registerRequest.getLoginId()).orElseGet(() -> {
            userService.register(null);
            return userRepository.findByLoginId(registerRequest.getLoginId()).orElseThrow();
        });
    }

    @Test
    void testLoginLockAfterFailedAttempts() {
        UserLoginRequestDto loginRequest = new UserLoginRequestDto("testuser", "wrongpassword");

        // 비밀번호 5회 실패 시도
        for (int i = 0; i < 5; i++) {
            try {
                userService.login(loginRequest);
            } catch (Exception e) {
                assertEquals("FAILED_TO_LOGIN", e.getMessage()); // 로그인 실패 에러 확인
            }
        }

        // 5회 실패 후 로그인 제한 상태 확인
        UserEntity lockedUser = userRepository.findByLoginId("testuser").orElseThrow();
        assertTrue(lockedUser.isLoginLocked(), "사용자가 잠겨야 합니다.");
        assertEquals(5, lockedUser.getFailedLoginAttempts(), "실패 횟수는 5여야 합니다.");

        // 로그인 제한 시간(5분)이 지나기 전 로그인 시도
        assertThrows(Exception.class, () -> userService.login(loginRequest));

        // 제한 시간 경과 후 상태 확인
        lockedUser.setLastFailedLoginAttempt(LocalDateTime.now().minusMinutes(6));
        userRepository.save(lockedUser);

        // 올바른 비밀번호로 로그인 성공 확인
        UserLoginRequestDto correctLoginRequest = new UserLoginRequestDto("testuser", "password123");
        assertDoesNotThrow(() -> userService.login(correctLoginRequest));

        UserEntity unlockedUser = userRepository.findByLoginId("testuser").orElseThrow();
        assertFalse(unlockedUser.isLoginLocked(), "사용자는 잠금 해제되어야 합니다.");
        assertEquals(0, unlockedUser.getFailedLoginAttempts(), "실패 횟수는 초기화되어야 합니다.");
    }
}
