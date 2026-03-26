package com.sgr.backend.user.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserListItemResponse {
    private Long id;
    private String fullName;
    private String email;
    private String identifier;
    private String role;
    private Boolean active;
}