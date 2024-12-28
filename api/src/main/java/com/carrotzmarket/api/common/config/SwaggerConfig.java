package com.carrotzmarket.api.common.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .addServersItem(new Server().url("/"))
                .info(new Info()
                        .title("User API Documentation")
                        .description("API for managing users")
                        .version("1.0.0"));
    }

//    @Bean
//    public GroupedOpenApi userApi() {
//        return GroupedOpenApi.builder()
//                .group("User API")
//                .packagesToScan("com.carrotzmarket.api.domain.user.controller")
//                .build();
//    }
//
//    @Bean
//    public GroupedOpenApi productApi() {
//        return GroupedOpenApi.builder()
//                .group("Product API")
//                .packagesToScan("com.carrotzmarket.api.domain.product.controller")
//                .build();
//    }
}

