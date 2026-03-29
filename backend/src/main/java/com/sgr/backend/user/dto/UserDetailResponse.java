package com.sgr.backend.user.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class UserDetailResponse {
    private Long id;
    private String name;
    private String lastName;
    private String email;
    private String identifier;
    private String role;
    private Boolean active;
    private LocalDate birthDate;
    private String userType;
    private String phone;
}