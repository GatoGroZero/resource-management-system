package com.sgr.backend.user.service;

import com.sgr.backend.common.enums.Role;
import com.sgr.backend.user.dto.CreateUserRequest;
import com.sgr.backend.user.dto.UserListItemResponse;
import com.sgr.backend.user.entity.User;
import com.sgr.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Page<UserListItemResponse> getUsers(int page, int size, String filter, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());

        Page<User> usersPage;

        if (search != null && !search.isBlank()) {
            usersPage = userRepository
                    .findByNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrIdentifierContainingIgnoreCase(
                            search, search, search, pageable
                    );
        } else if (filter != null && !filter.isBlank()) {
            switch (filter.toUpperCase()) {
                case "STUDENTS" -> usersPage = userRepository.findByRole(Role.STUDENT, pageable);
                case "STAFF" -> usersPage = userRepository.findByRole(Role.STAFF, pageable);
                case "ACTIVE" -> usersPage = userRepository.findByActive(true, pageable);
                case "INACTIVE" -> usersPage = userRepository.findByActive(false, pageable);
                default -> usersPage = userRepository.findAll(pageable);
            }
        } else {
            usersPage = userRepository.findAll(pageable);
        }

        return usersPage.map(this::toResponse);
    }

    public void createUser(CreateUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El correo ya está en uso");
        }

        User user = User.builder()
                .name(request.getName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .identifier(request.getIdentifier())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(request.getActive() != null ? request.getActive() : true)
                .birthDate(request.getBirthDate())
                .userType(request.getUserType())
                .phone(request.getPhone())
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
    }

    private UserListItemResponse toResponse(User user) {
        return UserListItemResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .lastName(user.getLastName())
                .fullName(user.getName() + " " + user.getLastName())
                .email(user.getEmail())
                .identifier(user.getIdentifier())
                .role(user.getRole().name())
                .userType(user.getUserType())
                .phone(user.getPhone())
                .active(user.getActive())
                .build();
    }
}