package com.sgr.backend.reservation.service;

import com.sgr.backend.common.enums.Role;
import com.sgr.backend.equipment.entity.Equipment;
import com.sgr.backend.equipment.repository.EquipmentRepository;
import com.sgr.backend.reservation.dto.*;
import com.sgr.backend.reservation.entity.*;
import com.sgr.backend.reservation.repository.ReservationRepository;
import com.sgr.backend.space.entity.Space;
import com.sgr.backend.space.repository.SpaceRepository;
import com.sgr.backend.user.entity.User;
import com.sgr.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final SpaceRepository spaceRepository;
    private final EquipmentRepository equipmentRepository;

    public Page<ReservationListItemResponse> getReservations(int page, int size, String filter) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        Page<Reservation> reservationsPage;

        if (filter != null && !filter.isBlank()) {
            switch (filter.toUpperCase()) {
                case "PENDIENTE" -> reservationsPage = reservationRepository.findByStatus(ReservationStatus.PENDIENTE, pageable);
                case "APROBADA" -> reservationsPage = reservationRepository.findByStatus(ReservationStatus.APROBADA, pageable);
                case "RECHAZADA" -> reservationsPage = reservationRepository.findByStatus(ReservationStatus.RECHAZADA, pageable);
                case "CANCELADA" -> reservationsPage = reservationRepository.findByStatus(ReservationStatus.CANCELADA, pageable);
                case "SPACE" -> reservationsPage = reservationRepository.findByResourceType(ReservationResourceType.SPACE, pageable);
                case "EQUIPMENT" -> reservationsPage = reservationRepository.findByResourceType(ReservationResourceType.EQUIPMENT, pageable);
                default -> reservationsPage = reservationRepository.findAll(pageable);
            }
        } else {
            reservationsPage = reservationRepository.findAll(pageable);
        }

        return reservationsPage.map(this::toListResponse);
    }

    public ReservationDetailResponse getReservationById(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        return toDetailResponse(reservation);
    }

    public ReservationFormOptionsResponse getFormOptions() {
        List<ReservationOptionResponse> users = userRepository.findByActiveTrue()
                .stream()
                .map(user -> ReservationOptionResponse.builder()
                        .id(user.getId())
                        .label(user.getName() + " " + user.getLastName())
                        .build())
                .toList();

        List<ReservationOptionResponse> spaces = spaceRepository.findByActiveTrue()
                .stream()
                .map(space -> ReservationOptionResponse.builder()
                        .id(space.getId())
                        .label(space.getName())
                        .build())
                .toList();

        List<ReservationOptionResponse> equipments = equipmentRepository.findByActiveTrue()
                .stream()
                .map(equipment -> ReservationOptionResponse.builder()
                        .id(equipment.getId())
                        .label(equipment.getInventoryNumber() + " - " + equipment.getName())
                        .build())
                .toList();

        return ReservationFormOptionsResponse.builder()
                .users(users)
                .spaces(spaces)
                .equipments(equipments)
                .build();
    }

    public void createReservation(CreateReservationRequest request) {
        if (request.getRequesterId() == null || request.getResourceType() == null || request.getResourceId() == null
                || request.getReservationDate() == null || request.getStartTime() == null || request.getEndTime() == null
                || request.getPurpose() == null || request.getPurpose().isBlank()) {
            throw new RuntimeException("Datos inválidos");
        }

        if (request.getReservationDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Fecha de reserva no válida");
        }

        if (!request.getEndTime().isAfter(request.getStartTime())) {
            throw new RuntimeException("Horario no válido");
        }

        User requester = userRepository.findById(request.getRequesterId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!Boolean.TRUE.equals(requester.getActive())) {
            throw new RuntimeException("Usuario no válido");
        }

        Reservation.ReservationBuilder builder = Reservation.builder()
                .requester(requester)
                .resourceType(request.getResourceType())
                .reservationDate(request.getReservationDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(normalizeText(request.getPurpose()))
                .observations(normalizeNullableText(request.getObservations()))
                .status(ReservationStatus.PENDIENTE)
                .createdAt(LocalDateTime.now());

        List<ReservationStatus> blockingStatuses = List.of(ReservationStatus.PENDIENTE, ReservationStatus.APROBADA);

        if (request.getResourceType() == ReservationResourceType.SPACE) {
            Space space = spaceRepository.findById(request.getResourceId())
                    .orElseThrow(() -> new RuntimeException("Espacio no encontrado"));

            if (!Boolean.TRUE.equals(space.getActive())) {
                throw new RuntimeException("Espacio no válido");
            }

            if (requester.getRole() == Role.STUDENT && !Boolean.TRUE.equals(space.getAllowStudents())) {
                throw new RuntimeException("Acceso no permitido");
            }

            boolean overlaps = reservationRepository.existsBySpaceAndReservationDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                    space,
                    request.getReservationDate(),
                    blockingStatuses,
                    request.getEndTime(),
                    request.getStartTime()
            );

            if (overlaps) {
                throw new RuntimeException("Horario no disponible");
            }

            builder.space(space);
        } else {
            Equipment equipment = equipmentRepository.findById(request.getResourceId())
                    .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

            if (!Boolean.TRUE.equals(equipment.getActive())) {
                throw new RuntimeException("Equipo no válido");
            }

            if (requester.getRole() == Role.STUDENT && !Boolean.TRUE.equals(equipment.getAllowStudents())) {
                throw new RuntimeException("Acceso no permitido");
            }

            boolean overlaps = reservationRepository.existsByEquipmentAndReservationDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                    equipment,
                    request.getReservationDate(),
                    blockingStatuses,
                    request.getEndTime(),
                    request.getStartTime()
            );

            if (overlaps) {
                throw new RuntimeException("Horario no disponible");
            }

            builder.equipment(equipment);
        }

        reservationRepository.save(builder.build());
    }

    public void approveReservation(Long id, String adminComment) {
        Reservation reservation = getReservationEntity(id);

        if (reservation.getStatus() != ReservationStatus.PENDIENTE) {
            throw new RuntimeException("La reserva ya no se puede aprobar");
        }

        reservation.setStatus(ReservationStatus.APROBADA);
        reservation.setAdminComment(normalizeNullableText(adminComment));
        reservationRepository.save(reservation);
    }

    public void rejectReservation(Long id, String adminComment) {
        Reservation reservation = getReservationEntity(id);

        if (reservation.getStatus() != ReservationStatus.PENDIENTE) {
            throw new RuntimeException("La reserva ya no se puede rechazar");
        }

        reservation.setStatus(ReservationStatus.RECHAZADA);
        reservation.setAdminComment(normalizeNullableText(adminComment));
        reservationRepository.save(reservation);
    }

    public void cancelReservation(Long id) {
        Reservation reservation = getReservationEntity(id);

        if (reservation.getStatus() == ReservationStatus.RECHAZADA || reservation.getStatus() == ReservationStatus.CANCELADA) {
            throw new RuntimeException("La reserva ya no se puede cancelar");
        }

        reservation.setStatus(ReservationStatus.CANCELADA);
        reservationRepository.save(reservation);
    }

    private Reservation getReservationEntity(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
    }

    private String normalizeText(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s{2,}", " ");
    }

    private String normalizeNullableText(String value) {
        if (value == null) return null;
        String cleaned = value.trim().replaceAll("\\s{2,}", " ");
        return cleaned.isBlank() ? null : cleaned;
    }

    private ReservationListItemResponse toListResponse(Reservation reservation) {
        String resourceName = reservation.getResourceType() == ReservationResourceType.SPACE
                ? reservation.getSpace().getName()
                : reservation.getEquipment().getName();

        return ReservationListItemResponse.builder()
                .id(reservation.getId())
                .requesterName(reservation.getRequester().getName() + " " + reservation.getRequester().getLastName())
                .requesterType(reservation.getRequester().getUserType())
                .resourceType(reservation.getResourceType().name())
                .resourceName(resourceName)
                .reservationDate(reservation.getReservationDate().toString())
                .schedule(reservation.getStartTime() + " - " + reservation.getEndTime())
                .status(reservation.getStatus().name())
                .build();
    }

    private ReservationDetailResponse toDetailResponse(Reservation reservation) {
        String resourceName = reservation.getResourceType() == ReservationResourceType.SPACE
                ? reservation.getSpace().getName()
                : reservation.getEquipment().getName();

        return ReservationDetailResponse.builder()
                .id(reservation.getId())
                .requesterName(reservation.getRequester().getName() + " " + reservation.getRequester().getLastName())
                .requesterEmail(reservation.getRequester().getEmail())
                .requesterType(reservation.getRequester().getUserType())
                .resourceType(reservation.getResourceType().name())
                .resourceName(resourceName)
                .reservationDate(reservation.getReservationDate().toString())
                .startTime(reservation.getStartTime().toString())
                .endTime(reservation.getEndTime().toString())
                .purpose(reservation.getPurpose())
                .observations(reservation.getObservations())
                .status(reservation.getStatus().name())
                .adminComment(reservation.getAdminComment())
                .build();
    }

    public List<ReservationListItemResponse> getReservationsBySpaceId(Long spaceId) {
        return reservationRepository.findBySpaceIdOrderByReservationDateDesc(spaceId)
                .stream()
                .map(this::toListResponse)
                .toList();
    }

    public List<ReservationListItemResponse> getReservationsByEquipmentId(Long equipmentId) {
        return reservationRepository.findByEquipmentIdOrderByReservationDateDesc(equipmentId)
                .stream()
                .map(this::toListResponse)
                .toList();
    }
    public Page<ReservationListItemResponse> getAuditRecords(int page, int size, String filter) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());

        List<ReservationStatus> auditStatuses = List.of(
                ReservationStatus.APROBADA,
                ReservationStatus.RECHAZADA,
                ReservationStatus.CANCELADA
        );

        Page<Reservation> reservationsPage;

        if (filter != null && !filter.isBlank()) {
            switch (filter.toUpperCase()) {
                case "SPACE" -> reservationsPage = reservationRepository.findByStatusInAndResourceType(auditStatuses, ReservationResourceType.SPACE, pageable);
                case "EQUIPMENT" -> reservationsPage = reservationRepository.findByStatusInAndResourceType(auditStatuses, ReservationResourceType.EQUIPMENT, pageable);
                case "APROBADA" -> reservationsPage = reservationRepository.findByStatus(ReservationStatus.APROBADA, pageable);
                case "RECHAZADA" -> reservationsPage = reservationRepository.findByStatus(ReservationStatus.RECHAZADA, pageable);
                case "CANCELADA" -> reservationsPage = reservationRepository.findByStatus(ReservationStatus.CANCELADA, pageable);
                default -> reservationsPage = reservationRepository.findByStatusIn(auditStatuses, pageable);
            }
        } else {
            reservationsPage = reservationRepository.findByStatusIn(auditStatuses, pageable);
        }

        return reservationsPage.map(this::toListResponse);
    }
}