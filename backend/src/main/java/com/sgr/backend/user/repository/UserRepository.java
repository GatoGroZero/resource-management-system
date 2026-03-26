package com.sgr.backend.user.repository;

import com.sgr.backend.common.enums.Role;
import com.sgr.backend.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Page<User> findByRole(Role role, Pageable pageable);

    Page<User> findByActive(Boolean active, Pageable pageable);

    Page<User> findByNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrIdentifierContainingIgnoreCase(
            String name,
            String lastName,
            String identifier,
            Pageable pageable
    );
}