package com.example.demo.config; // Tùy chỉnh theo package thực tế

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*") // Cho phép tất cả
                .allowedMethods("*") // Cho phép tất cả method (GET, POST, PUT, DELETE...)
                .allowedHeaders("*");
    }
}