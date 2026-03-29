package com.sgr.backend.reservation.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReservationListItemResponse {
    private Long id;
    private String requesterName;
    private String requesterType;
    private String resourceType;
    private String resourceName;
    private String reservationDate;
    private String schedule;
    private String status;
}