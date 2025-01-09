//package com.carrotzmarket.api.domain.user.session;
//
//import com.carrotzmarket.api.domain.user.controller.UserOpenApiController;
//import com.carrotzmarket.api.domain.user.dto.request.LoginRequest;
//import com.carrotzmarket.api.domain.user.dto.response.UserResponse;
//import com.carrotzmarket.api.domain.user.dto.response.UserSession;
//import com.carrotzmarket.api.domain.user.service.UserManagementService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//import org.springframework.http.MediaType;
//import org.springframework.mock.web.MockHttpSession;
//import org.springframework.test.web.servlet.MockMvc;
//import org.springframework.test.web.servlet.setup.MockMvcBuilders;
//
//import static org.mockito.BDDMockito.given;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.request;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//
//@ExtendWith(MockitoExtension.class)
//public class UserOpenApiControllerTest {
//
//    private MockMvc mockMvc;
//
//    @Mock
//    private UserManagementService userManagementService;
//
//    @InjectMocks
//    private UserOpenApiController userOpenApiController; // Mock 객체를 주입받을 컨트롤러
//
//    private ObjectMapper objectMapper;
//
//    @BeforeEach
//    void setup() {
//        mockMvc = MockMvcBuilders.standaloneSetup(userOpenApiController).build(); // MockMvc 초기화
//        objectMapper = new ObjectMapper(); // ObjectMapper 수동 초기화
//    }
//
//    @Test
//    void login_create_session() throws Exception {
//        // GIVEN: Mock 데이터 준비
//        LoginRequest request = new LoginRequest("test", "password");
//        UserResponse response = new UserResponse();
//        response.setLoginId("test");
//        response.setEmail("test@gmail.com");
//        response.setPhone("010-1111-1111");
//        response.setProfileImageUrl("asdasdasd");
//        response.setRegion("aaaa");
//
//        // Mock의 반환값 설정
//        given(userManagementService.login(request)).willReturn(response);
//
//
//        // WHEN: 로그인 요청 실행
//        mockMvc.perform(post("/open-api/user/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request)))
//                .andExpect(status().isOk())
//                .andExpect(request().sessionAttribute("userSession",
//                        new UserSession(null, "test", "test@gmail.com", "010-1111-1111", "asdasdasd", "aaaa"))) // 세션 검증
//                .andExpect(jsonPath("$.data.loginId").value("test"));
//    }
//
//    @Test
//    void session_expiresAfterTimeout() throws Exception {
//        // GIVEN: Mock 데이터 준비
//        LoginRequest request = new LoginRequest("testUser", "testPassword");
//        UserResponse response = new UserResponse();
//        response.setLoginId("testUser");
//        response.setEmail("testUser@gmail.com");
//        response.setPhone("010-1234-5678");
//        response.setProfileImageUrl("default_image_url");
//        response.setRegion("regionName");
//
//        // Mock의 반환값 설정
//        given(userManagementService.login(request)).willReturn(response);
//
//        // MockHttpSession 객체 생성
//        MockHttpSession session = new MockHttpSession();
//
//        // 로그인 요청으로 세션 생성
//        mockMvc.perform(post("/open-api/user/login")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(request))
//                        .session(session))
//                .andExpect(status().isOk())
//                .andExpect(request().sessionAttribute("userSession",
//                        new UserSession(null, "testUser", "testUser@gmail.com", "010-1234-5678", "default_image_url", "regionName")));
//
//        // 세션 만료 시뮬레이션
//        session.invalidate();
//
//        // 세션 상태 확인 API 호출
//        mockMvc.perform(get("/open-api/user/session-status") // session-status 호출
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .session(session)) // 만료된 세션 사용
//                .andExpect(status().isUnauthorized()); // 401 기대
//    }
//}
