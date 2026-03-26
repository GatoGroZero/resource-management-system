package com.sgr.backend.space.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SpaceDetailResponse {
    private Long id;
    private String name;
    private String category;
    private String location;
    private Integer capacity;
    private Boolean active;
    private String availability;
}