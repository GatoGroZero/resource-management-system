package com.sgr.backend.equipment.dto;

import com.sgr.backend.equipment.entity.EquipmentCondition;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateEquipmentRequest {

    @NotBlank(message = "El número de inventario es obligatorio")
    private String inventoryNumber;

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    @NotBlank(message = "La categoría es obligatoria")
    private String category;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 10, max = 500, message = "La descripción debe tener entre 10 y 500 caracteres")
    private String description;

    @NotNull(message = "Debe indicar si permite estudiantes")
    private Boolean allowStudents;

    private Boolean active;

    @NotNull(message = "La condición es obligatoria")
    private EquipmentCondition condition;

    private Long spaceId;
}