package com.sgr.backend.dashboard.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DashboardStatsResponse {
    private long totalUsers;
    private long activeUsers;
    private long totalSpaces;
    private long totalEquipments;
    private long pendingReservations;
    private long approvedReservations;
    private long rejectedReservations;
    private long totalReservations;
    private long pendingRequests;
    private long totalRequests;
}