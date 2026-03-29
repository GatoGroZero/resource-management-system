package com.sgr.backend.reservation.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ReservationFormOptionsResponse {
    private List<ReservationOptionResponse> users;
    private List<ReservationOptionResponse> spaces;
    private List<ReservationOptionResponse> equipments;
}