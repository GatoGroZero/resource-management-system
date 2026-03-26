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

            if (!userRepository.existsByEmail("20243ds003@gmail.com")) {
                userRepository.save(User.builder()
                        .name("Carlos")
                        .lastName("Admin Control")
                        .email("20243ds003@gmail.com")
                        .identifier("ADM-2026-001")
                        .password(passwordEncoder.encode("12345678"))
                        .role(Role.ADMIN)
                        .active(true)
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
                        .createdAt(LocalDateTime.now())
                        .build());
            }

            if (!userRepository.existsByEmail("personal@sgr.com")) {
                userRepository.save(User.builder()
                        .name("Juan")
                        .lastName("Pérez García")
                        .email("personal@sgr.com")
                        .identifier("EMP-2026-001")
                        .password(passwordEncoder.encode("Personal123*"))
                        .role(Role.STAFF)
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .build());
            }

            if (!userRepository.existsByEmail("ana.inactiva@sgr.com")) {
                userRepository.save(User.builder()
                        .name("Ana")
                        .lastName("Martínez Sánchez")
                        .email("ana.inactiva@sgr.com")
                        .identifier("20233TI002")
                        .password(passwordEncoder.encode("12345678"))
                        .role(Role.STUDENT)
                        .active(false)
                        .createdAt(LocalDateTime.now())
                        .build());
            }

            if (!userRepository.existsByEmail("roberto@sgr.com")) {
                userRepository.save(User.builder()
                        .name("Roberto")
                        .lastName("Flores Díaz")
                        .email("roberto@sgr.com")
                        .identifier("20233TI003")
                        .password(passwordEncoder.encode("12345678"))
                        .role(Role.STUDENT)
                        .active(true)
                        .createdAt(LocalDateTime.now())
                        .build());
            }
        };
    }
}