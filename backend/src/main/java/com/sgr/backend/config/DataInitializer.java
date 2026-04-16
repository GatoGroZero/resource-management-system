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

            // ADMIN
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
                        .phone("7770912773")
                        .createdAt(LocalDateTime.now())
                        .build());
            }

            // ESTUDIANTE
            if (!userRepository.existsByEmail("20243ds004@utez.edu.mx")) {
                userRepository.save(User.builder()
                        .name("Luis")
                        .lastName("Estudiante Demo")
                        .email("20243ds004@utez.edu.mx")
                        .identifier("20243ds004")
                        .password(passwordEncoder.encode("12345678"))
                        .role(Role.STUDENT)
                        .active(true)
                        .birthDate(LocalDate.of(2003, 5, 10))
                        .userType("Estudiante")
                        .phone("7776798227")
                        .createdAt(LocalDateTime.now())
                        .build());
            }

            // PERSONAL
            if (!userRepository.existsByEmail("20233tn141@utez.edu.mx")) {
                userRepository.save(User.builder()
                        .name("Personal")
                        .lastName("UTEZ Demo")
                        .email("20233tn141@utez.edu.mx")
                        .identifier("20233tn141")
                        .password(passwordEncoder.encode("12345678"))
                        .role(Role.STAFF)
                        .active(true)
                        .birthDate(LocalDate.of(1995, 8, 15))
                        .userType("Personal Académico")
                        .phone("77770184661")
                        .createdAt(LocalDateTime.now())
                        .build());
            }
        };
    }
}