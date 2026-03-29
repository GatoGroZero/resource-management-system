package com.sgr.backend.reservation.dto;

import com.sgr.backend.reservation.entity.ReservationResourceType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class CreateReservationRequest {
    private Long requesterId;
    private ReservationResourceType resourceType;
    private Long resourceId;
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private String purpose;
    private String observations;
}