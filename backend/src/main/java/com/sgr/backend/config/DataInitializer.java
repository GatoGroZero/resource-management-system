package com.sgr.backend.config;

import com.sgr.backend.common.enums.Role;
import com.sgr.backend.user.entity.User;
import com.sgr.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initAdminUser() {
        return args -> {
            if (!userRepository.existsByEmail("admin@sgr.com")) {
                User admin = User.builder()
                        .name("Admin")
                        .lastName("Principal")
                        .email("admin@sgr.com")
                        .password(passwordEncoder.encode("Admin123*"))
                        .role(Role.ADMIN)
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .build();

                userRepository.save(admin);
            }
        };
    }
}