package com.sgr.backend.space.dto;

import com.sgr.backend.space.entity.SpaceAvailability;
import com.sgr.backend.space.entity.SpaceCategory;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateSpaceRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotNull(message = "La categoría es obligatoria")
    private SpaceCategory category;

    @NotBlank(message = "La ubicación es obligatoria")
    private String location;

    @NotNull(message = "La capacidad es obligatoria")
    @Min(value = 1, message = "La capacidad mínima es 1")
    private Integer capacity;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 10, max = 500, message = "La descripción debe tener entre 10 y 500 caracteres")
    private String description;

    @NotNull(message = "Debe indicar si permite estudiantes")
    private Boolean allowStudents;

    private Boolean active;

    @NotNull(message = "La disponibilidad es obligatoria")
    private SpaceAvailability availability;
}