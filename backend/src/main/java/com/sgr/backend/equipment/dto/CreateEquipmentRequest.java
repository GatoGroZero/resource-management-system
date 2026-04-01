package com.sgr.backend.equipment.dto;

import com.sgr.backend.equipment.entity.EquipmentCondition;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateEquipmentRequest {
    private String inventoryNumber;
    private String name;
    private String category;
    private String description;
    private Boolean allowStudents;
    private Boolean active;
    private EquipmentCondition condition;
    private Long spaceId;
}