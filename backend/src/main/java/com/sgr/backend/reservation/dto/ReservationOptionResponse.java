package com.sgr.backend.reservation.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReservationOptionResponse {
    private Long id;
    private String label;
}