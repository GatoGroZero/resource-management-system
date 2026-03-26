package com.sgr.backend.user.service;

import com.sgr.backend.common.enums.Role;
import com.sgr.backend.user.dto.UserListItemResponse;
import com.sgr.backend.user.entity.User;
import com.sgr.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

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

    private UserListItemResponse toResponse(User user) {
        return UserListItemResponse.builder()
                .id(user.getId())
                .fullName(user.getName() + " " + user.getLastName())
                .email(user.getEmail())
                .identifier(user.getIdentifier())
                .role(user.getRole().name())
                .active(user.getActive())
                .build();
    }
}