package com.sgr.backend.auth.dto;

import com.sgr.backend.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class LoginResponse {
    private String token;
    private String tokenType;
    private Long userId;
    private String name;
    private String lastName;
    private String email;
    private Role role;
}