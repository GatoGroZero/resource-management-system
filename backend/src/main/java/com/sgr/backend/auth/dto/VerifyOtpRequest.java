package com.sgr.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyOtpRequest {

    @NotBlank(message = "El correo es obligatorio")
    private String email;

    @NotBlank(message = "El código es obligatorio")
    private String code;
}