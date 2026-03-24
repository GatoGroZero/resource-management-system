package com.sgr.backend.request.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestDecisionRequest {

    @NotBlank(message = "El correo del admin es obligatorio")
    private String adminEmail;

    private String responseMessage;
}