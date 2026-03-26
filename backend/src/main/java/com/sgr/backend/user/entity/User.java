package com.sgr.backend.user.entity;

import com.sgr.backend.common.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true)
    private String identifier;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private Boolean active;

    private LocalDateTime createdAt;
}