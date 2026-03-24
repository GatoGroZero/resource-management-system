package com.sgr.backend.request.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRequestRequest {

    @NotBlank(message = "El título es obligatorio")
    private String title;

    @NotBlank(message = "La descripción es obligatoria")
    private String description;

    @NotBlank(message = "El correo del solicitante es obligatorio")
    private String requesterEmail;
}