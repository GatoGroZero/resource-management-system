package com.sgr.backend.reservation.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReturnReservationRequest {

    @NotBlank(message = "El estado de devolución es obligatorio")
    private String returnCondition;

    private String returnDescription;
}