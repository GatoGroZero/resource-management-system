package com.sgr.backend.config;

import com.sgr.backend.common.enums.Role;
import com.sgr.backend.user.entity.User;
import com.sgr.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initUsers() {
        return args -> {
            if (!userRepository.existsByEmail("admin@sgr.com")) {
                userRepository.save(User.builder()
                        .name("Admin")
                        .lastName("Principal")
                        .email("admin@sgr.com")
                        .password(passwordEncoder.encode("Admin123*"))
                        .role(Role.ADMIN)
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .build());
            }

            if (!userRepository.existsByEmail("estudiante@sgr.com")) {
                userRepository.save(User.builder()
                        .name("Juan")
                        .lastName("Estudiante")
                        .email("estudiante@sgr.com")
                        .password(passwordEncoder.encode("Estudiante123*"))
                        .role(Role.STUDENT)
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .build());
            }

            if (!userRepository.existsByEmail("personal@sgr.com")) {
                userRepository.save(User.builder()
                        .name("Maria")
                        .lastName("Personal")
                        .email("personal@sgr.com")
                        .password(passwordEncoder.encode("Personal123*"))
                        .role(Role.STAFF)
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .build());
            }
        };
    }
}