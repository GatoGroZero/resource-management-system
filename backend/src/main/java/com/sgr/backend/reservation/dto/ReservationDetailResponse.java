package com.sgr.backend.reservation.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReservationDetailResponse {
    private Long id;
    private String requesterName;
    private String requesterEmail;
    private String requesterType;
    private String resourceType;
    private String resourceName;
    private String reservationDate;
    private String startTime;
    private String endDate;
    private String endTime;
    private String purpose;
    private String observations;
    private String status;
    private String adminComment;
    private String returnCondition;
    private String returnDescription;
    private String returnedAt;
}