package com.carrotzmarket.api.common.config;

import ch.rasc.sse.eventbus.DefaultSubscriptionRegistry;
import ch.rasc.sse.eventbus.SseEventBus;
import ch.rasc.sse.eventbus.SubscriptionRegistry;
import ch.rasc.sse.eventbus.config.SseEventBusConfigurer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EventBusConfig {

    @Bean
    public SubscriptionRegistry subscriptionRegistry() {
        return new DefaultSubscriptionRegistry();
    }

    @Bean
    public SseEventBusConfigurer sseEventBusConfigurer() {
        return new SseEventBusConfigurer() {
        };
    }

    @Bean
    public SseEventBus eventBus(SubscriptionRegistry subscriptionRegistry, SseEventBusConfigurer sseEventBusConfigurer) {
        return new SseEventBus(sseEventBusConfigurer, subscriptionRegistry);
    }
}
