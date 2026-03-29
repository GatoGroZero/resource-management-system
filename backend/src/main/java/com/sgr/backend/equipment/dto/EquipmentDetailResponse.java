package com.sgr.backend.equipment.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EquipmentDetailResponse {
    private Long id;
    private String inventoryNumber;
    private String name;
    private String category;
    private String description;
    private Boolean allowStudents;
    private Boolean active;
    private String condition;
}