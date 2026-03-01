package com.example.stud_erp.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                return http
                                .csrf(AbstractHttpConfigurer::disable)
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .authorizeHttpRequests((authorize) -> authorize
                                                .requestMatchers("/api/students/login", "/api/professors/login",
                                                                "/api/hods/login",
                                                                "/api/admin/auth/login")
                                                .permitAll()
                                                .requestMatchers("/api/students/forgot-password",
                                                                "/api/professors/forgot-password",
                                                                "/api/hods/forgot-password",
                                                                "/api/admin/auth/forgot-password")
                                                .permitAll()
                                                .requestMatchers("/api/students/verify-otp",
                                                                "/api/professors/verify-otp",
                                                                "/api/hods/verify-otp",
                                                                "/api/admin/auth/verify-otp")
                                                .permitAll()
                                                .requestMatchers("/api/students/reset-password",
                                                                "/api/professors/reset-password",
                                                                "/api/hods/reset-password",
                                                                "/api/admin/auth/reset-password")
                                                .permitAll()
                                                .requestMatchers("/api/students/add-student",
                                                                "/api/professors/add-prof", "/api/hods/add-hod",
                                                                "/api/admin/auth/signup")
                                                .permitAll()
                                                .requestMatchers("/api/departments/get-dept")
                                                .permitAll()
                                                .requestMatchers("/api/admin/**")
                                                .permitAll()
                                                .requestMatchers("/api/notifications/**")
                                                .permitAll()
                                                .requestMatchers(org.springframework.http.HttpMethod.POST,
                                                                "/api/notifications/send")
                                                .permitAll()
                                                .requestMatchers("/api/attendance/**")
                                                .permitAll()
                                                .requestMatchers("/api/email/**")
                                                .permitAll()
                                                .requestMatchers("/api/payments/**")
                                                .permitAll()
                                                .requestMatchers("/api/razorpay/**")
                                                .permitAll()
                                                .requestMatchers(org.springframework.http.HttpMethod.PUT,
                                                                "/api/students/**",
                                                                "/api/professors/**",
                                                                "/api/hods/**", "/api/admin/auth/**")
                                                .permitAll()
                                                .requestMatchers(org.springframework.http.HttpMethod.GET,
                                                                "/api/students/*",
                                                                "/api/professors/*",
                                                                "/api/hods/*", "/api/admin/auth/*", "/api/admin/**")
                                                .permitAll()
                                                .requestMatchers("/api/**").authenticated()
                                                .anyRequest().permitAll())
                                .build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOriginPatterns(Arrays.asList("*"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList("*"));
                configuration.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }
}
