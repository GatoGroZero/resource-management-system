package com.sgr.backend.space.dto;

import com.sgr.backend.space.entity.SpaceAvailability;
import com.sgr.backend.space.entity.SpaceCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateSpaceRequest {
    private String name;
    private SpaceCategory category;
    private String location;
    private Integer capacity;
    private String description;
    private Boolean allowStudents;
    private Boolean active;
    private SpaceAvailability availability;
}