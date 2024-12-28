//package com.carrotzmarket.api.domain.user;
//
//import com.carrotzmarket.api.domain.user.dto.request.RegisterRequest;
//import com.carrotzmarket.api.domain.user.dto.response.UserResponse;
//import com.carrotzmarket.api.domain.user.repository.UserRepository;
//import com.carrotzmarket.api.domain.user.service.UserBasicService;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDate;
//
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.junit.jupiter.api.Assertions.assertNotNull;
//
//@SpringBootTest
//@Transactional
//public class UserBasicServiceTest {
//
//    @Autowired
//    private UserBasicService userBasicService;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Test
//    void registerUserSuccessfully() {
//        RegisterRequest request = new RegisterRequest(
//                "testUser",
//                "password123",
//                "test@example.com",
//                "010-1234-5678",
//                LocalDate.of(1990, 1, 1),
//                1L
//        );
//
//        UserResponse response = userBasicService.register(request, null);
//
//        assertNotNull(response);
//        assertEquals("testUser", response.getLoginId());
//    }
//}
//
