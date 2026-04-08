package com.sgr.backend.reservation.dto;

import com.sgr.backend.reservation.entity.ReservationResourceType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class CreateReservationRequest {

    @NotNull(message = "El solicitante es obligatorio")
    private Long requesterId;

    @NotNull(message = "El tipo de recurso es obligatorio")
    private ReservationResourceType resourceType;

    @NotNull(message = "El recurso es obligatorio")
    private Long resourceId;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate reservationDate;

    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime startTime;

    private LocalDate endDate;

    @NotNull(message = "La hora de fin es obligatoria")
    private LocalTime endTime;

    @NotBlank(message = "El motivo es obligatorio")
    @Size(min = 10, max = 500, message = "El motivo debe tener entre 10 y 500 caracteres")
    private String purpose;

    private String observations;
}