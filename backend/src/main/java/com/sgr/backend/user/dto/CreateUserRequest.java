package com.sgr.backend.user.dto;

import com.sgr.backend.common.enums.Role;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CreateUserRequest {
    private String name;
    private String lastName;
    private String email;
    private String identifier;
    private String password;
    private Role role;
    private Boolean active;
    private LocalDate birthDate;
    private String userType;
    private String phone;
}