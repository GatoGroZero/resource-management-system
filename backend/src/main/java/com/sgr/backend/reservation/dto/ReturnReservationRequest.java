package com.sgr.backend.reservation.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReturnReservationRequest {
    private String returnCondition;
    private String returnDescription;
}