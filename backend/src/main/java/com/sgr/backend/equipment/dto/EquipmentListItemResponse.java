package com.sgr.backend.equipment.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class EquipmentListItemResponse {
    private Long id;
    private String name;
    private String category;
    private String code;
    private Integer quantity;
    private String description;
    private Boolean allowStudents;
    private Boolean active;
    private String condition;
}