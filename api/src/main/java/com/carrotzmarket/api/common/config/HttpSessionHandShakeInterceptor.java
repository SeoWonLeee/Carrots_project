package com.carrotzmarket.api.common.config;

import com.carrotzmarket.api.domain.user.dto.response.UserSession;
import jakarta.servlet.http.HttpSession;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

@Slf4j
public class HttpSessionHandShakeInterceptor implements HandshakeInterceptor {
    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) throws Exception {


        log.info("HttpSessionHandShakeInterceptor 호출");
        if(request instanceof ServletServerHttpRequest servletRequest) {
            log.info("ServletServerHttpRequest 호출");
            HttpSession session = servletRequest.getServletRequest().getSession(false);

            if (session != null) {
                // 세션 ID를 웹 소켓 세션 속성에 추가
                attributes.put("sessionId", session.getId());

                log.info("Attribute 호출 = {}", attributes.get("sessionId"));

                // 세션에서 userSession 정보 추출
                UserSession userSession = (UserSession)session.getAttribute("userSession");
                log.info("userSession {}", userSession.getLoginId());

                if (userSession != null) {
                    attributes.put("userSession", userSession);
                }
            }
        }
            return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
                               Exception exception) {

    }
}
