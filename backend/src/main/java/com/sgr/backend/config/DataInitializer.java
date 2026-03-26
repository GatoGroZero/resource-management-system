package com.sgr.backend.config;

import com.sgr.backend.common.enums.Role;
import com.sgr.backend.user.entity.User;
import com.sgr.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initUsers() {
        return args -> {

            if (!userRepository.existsByEmail("20243ds003@utez.edu.mx")) {
                userRepository.save(User.builder()
                        .name("Admin")
                        .lastName("Principal")
                        .email("20243ds003@utez.edu.mx")
                        .identifier("20243ds003")
                        .password(passwordEncoder.encode("12345678"))
                        .role(Role.ADMIN)
                        .active(true)
                        .birthDate(LocalDate.of(2000, 1, 1))
                        .userType("Administrativo")
                        .phone("7770000000")
                        .createdAt(LocalDateTime.now())
                        .build());
            }

            if (!userRepository.existsByEmail("zeropanda0369@gmail.com")) {
                userRepository.save(User.builder()
                        .name("Maria")
                        .lastName("González López")
                        .email("zeropanda0369@gmail.com")
                        .identifier("20233TI001")
                        .password(passwordEncoder.encode("12345678"))
                        .role(Role.STUDENT)
                        .active(true)
                        .birthDate(LocalDate.of(2003, 5, 10))
                        .userType("Estudiante")
                        .phone("7771234567")
                        .createdAt(LocalDateTime.now())
                        .build());
            }

            if (!userRepository.existsByEmail("personal@sgr.com")) {
                userRepository.save(User.builder()
                        .name("Juan")
                        .lastName("Pérez García")
                        .email("personal@sgr.com")
                        .identifier("EMP-2026-001")
                        .password(passwordEncoder.encode("12345678"))
                        .role(Role.STAFF)
                        .active(true)
                        .birthDate(LocalDate.of(1995, 8, 15))
                        .userType("Personal Académico")
                        .phone("7777654321")
                        .createdAt(LocalDateTime.now())
                        .build());
            }
        };
    }
}