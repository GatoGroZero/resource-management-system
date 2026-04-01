package com.sgr.backend.dashboard.service;

import com.sgr.backend.dashboard.dto.DashboardStatsResponse;
import com.sgr.backend.equipment.repository.EquipmentRepository;
import com.sgr.backend.request.enums.RequestStatus;
import com.sgr.backend.request.repository.ReservationRequestRepository;
import com.sgr.backend.reservation.entity.ReservationStatus;
import com.sgr.backend.reservation.repository.ReservationRepository;
import com.sgr.backend.space.repository.SpaceRepository;
import com.sgr.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final SpaceRepository spaceRepository;
    private final EquipmentRepository equipmentRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationRequestRepository reservationRequestRepository;

    public DashboardStatsResponse getStats() {
        return DashboardStatsResponse.builder()
                .totalUsers(userRepository.count())
                .activeUsers(userRepository.countByActive(true))
                .totalSpaces(spaceRepository.count())
                .totalEquipments(equipmentRepository.count())
                .pendingReservations(reservationRepository.countByStatus(ReservationStatus.PENDIENTE))
                .approvedReservations(reservationRepository.countByStatus(ReservationStatus.APROBADA))
                .rejectedReservations(reservationRepository.countByStatus(ReservationStatus.RECHAZADA))
                .totalReservations(reservationRepository.count())
                .pendingRequests(reservationRequestRepository.countByStatus(RequestStatus.PENDING))
                .totalRequests(reservationRequestRepository.count())
                .build();
    }
}