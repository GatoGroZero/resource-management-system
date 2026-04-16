package com.sgr.backend.reservation.service;

import com.sgr.backend.common.enums.Role;
import com.sgr.backend.equipment.entity.Equipment;
import com.sgr.backend.equipment.repository.EquipmentRepository;
import com.sgr.backend.notification.EmailService;
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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final SpaceRepository spaceRepository;
    private final EquipmentRepository equipmentRepository;
    private final EmailService emailService;

    @Transactional(readOnly = true)
    public Page<ReservationListItemResponse> getReservations(int page, int size, String filter) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Reservation> rp;
        if (filter != null && !filter.isBlank()) {
            switch (filter.toUpperCase()) {
                case "PENDIENTE" -> rp = reservationRepository.findByStatus(ReservationStatus.PENDIENTE, pageable);
                case "APROBADA" -> rp = reservationRepository.findByStatus(ReservationStatus.APROBADA, pageable);
                case "RECHAZADA" -> rp = reservationRepository.findByStatus(ReservationStatus.RECHAZADA, pageable);
                case "CANCELADA" -> rp = reservationRepository.findByStatus(ReservationStatus.CANCELADA, pageable);
                case "DEVUELTA" -> rp = reservationRepository.findByStatus(ReservationStatus.DEVUELTA, pageable);
                case "SPACE" -> rp = reservationRepository.findByResourceType(ReservationResourceType.SPACE, pageable);
                case "EQUIPMENT" -> rp = reservationRepository.findByResourceType(ReservationResourceType.EQUIPMENT, pageable);
                default -> rp = reservationRepository.findAll(pageable);
            }
        } else { rp = reservationRepository.findAll(pageable); }
        return rp.map(this::toListResponse);
    }

    @Transactional(readOnly = true)
    public ReservationDetailResponse getReservationById(Long id) {
        return toDetailResponse(reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reserva no encontrada")));
    }

    @Transactional(readOnly = true)
    public ReservationFormOptionsResponse getFormOptions() {
        List<ReservationOptionResponse> users = userRepository.findByActiveTrue().stream()
                .map(u -> ReservationOptionResponse.builder().id(u.getId()).label(u.getName() + " " + u.getLastName()).build()).toList();
        List<ReservationOptionResponse> spaces = spaceRepository.findByActiveTrue().stream()
                .map(s -> ReservationOptionResponse.builder().id(s.getId()).label(s.getName()).build()).toList();
        List<ReservationOptionResponse> equipments = equipmentRepository.findByActiveTrue().stream()
                .map(e -> ReservationOptionResponse.builder().id(e.getId()).label(e.getInventoryNumber() + " - " + e.getName()).build()).toList();
        return ReservationFormOptionsResponse.builder().users(users).spaces(spaces).equipments(equipments).build();
    }

    @Transactional
    public void createReservation(CreateReservationRequest request) {
        if (request.getRequesterId() == null || request.getResourceType() == null || request.getResourceId() == null
                || request.getReservationDate() == null || request.getStartTime() == null || request.getEndTime() == null
                || request.getPurpose() == null || request.getPurpose().isBlank()) {
            throw new RuntimeException("Datos inválidos");
        }
        if (request.getReservationDate().isBefore(LocalDate.now())) throw new RuntimeException("Fecha de reserva no válida");

        LocalDate endDate = request.getEndDate() != null ? request.getEndDate() : request.getReservationDate();
        if (endDate.isBefore(request.getReservationDate())) throw new RuntimeException("La fecha de fin no puede ser antes de la fecha de inicio");

        if (request.getReservationDate().equals(endDate) && !request.getEndTime().isAfter(request.getStartTime())) {
            throw new RuntimeException("Horario no válido");
        }

        User requester = userRepository.findById(request.getRequesterId()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!Boolean.TRUE.equals(requester.getActive())) throw new RuntimeException("Usuario no válido");

        Reservation.ReservationBuilder builder = Reservation.builder()
                .requester(requester).resourceType(request.getResourceType())
                .reservationDate(request.getReservationDate()).startTime(request.getStartTime())
                .endDate(endDate).endTime(request.getEndTime())
                .purpose(normalizeText(request.getPurpose())).observations(normalizeNullableText(request.getObservations()))
                .status(ReservationStatus.PENDIENTE).createdAt(LocalDateTime.now());

        List<ReservationStatus> blockingStatuses = List.of(ReservationStatus.APROBADA);

        if (request.getResourceType() == ReservationResourceType.SPACE) {
            Space space = spaceRepository.findById(request.getResourceId()).orElseThrow(() -> new RuntimeException("Espacio no encontrado"));
            if (!Boolean.TRUE.equals(space.getActive())) throw new RuntimeException("Espacio no válido");
            if (requester.getRole() == Role.STUDENT && !Boolean.TRUE.equals(space.getAllowStudents())) throw new RuntimeException("Acceso no permitido");
            boolean overlaps = reservationRepository.existsBySpaceAndReservationDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(space, request.getReservationDate(), blockingStatuses, request.getEndTime(), request.getStartTime());
            if (overlaps) throw new RuntimeException("Horario no disponible");
            builder.space(space);
        } else {
            Equipment equipment = equipmentRepository.findById(request.getResourceId()).orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
            if (!Boolean.TRUE.equals(equipment.getActive())) throw new RuntimeException("Equipo no válido");
            if (requester.getRole() == Role.STUDENT && !Boolean.TRUE.equals(equipment.getAllowStudents())) throw new RuntimeException("Acceso no permitido");
            boolean overlaps = reservationRepository.existsByEquipmentAndReservationDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(equipment, request.getReservationDate(), blockingStatuses, request.getEndTime(), request.getStartTime());
            if (overlaps) throw new RuntimeException("Horario no disponible");
            builder.equipment(equipment);
        }

        Reservation saved = reservationRepository.save(builder.build());
        String rn = saved.getResourceType() == ReservationResourceType.SPACE ? saved.getSpace().getName() : saved.getEquipment().getName();
        String endDateStr = saved.getEndDate() != null ? saved.getEndDate().toString() : saved.getReservationDate().toString();
        try {
            emailService.sendReservationCreatedEmail(requester.getEmail(), rn,
                    saved.getReservationDate().toString(), endDateStr,
                    saved.getStartTime().toString(), saved.getEndTime().toString());
        } catch (Exception e) { }
    }

    @Transactional
    public void approveReservation(Long id, String adminComment) {
        Reservation r = getEntity(id);
        if (r.getStatus() != ReservationStatus.PENDIENTE) throw new RuntimeException("La reserva ya no se puede aprobar");

        // Validar que no haya otra reserva APROBADA en el mismo horario
        List<ReservationStatus> blockingStatuses = List.of(ReservationStatus.APROBADA);

        if (r.getResourceType() == ReservationResourceType.SPACE) {
            boolean overlaps = reservationRepository.existsBySpaceAndReservationDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                    r.getSpace(), r.getReservationDate(), blockingStatuses, r.getEndTime(), r.getStartTime());
            if (overlaps) throw new RuntimeException("No se puede aprobar: ya existe otra reserva aprobada en ese horario para este espacio");
        } else {
            boolean overlaps = reservationRepository.existsByEquipmentAndReservationDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
                    r.getEquipment(), r.getReservationDate(), blockingStatuses, r.getEndTime(), r.getStartTime());
            if (overlaps) throw new RuntimeException("No se puede aprobar: ya existe otra reserva aprobada en ese horario para este equipo");
        }

        // Aprobar esta reserva
        r.setStatus(ReservationStatus.APROBADA);
        r.setAdminComment(normalizeNullableText(adminComment));
        reservationRepository.save(r);

        // Rechazar automáticamente todas las PENDIENTES que se crucen en horario con este mismo recurso
        String resourceName = r.getResourceType() == ReservationResourceType.SPACE ? r.getSpace().getName() : r.getEquipment().getName();
        String autoRejectMessage = "Solicitud rechazada automáticamente: el recurso \"" + resourceName + "\" ya fue asignado a otro solicitante en un horario que se cruza con el tuyo (" + r.getReservationDate() + " de " + r.getStartTime() + " a " + r.getEndTime() + ").";

        List<Reservation> overlapping;

        if (r.getResourceType() == ReservationResourceType.SPACE) {
            overlapping = reservationRepository.findBySpaceAndReservationDateAndStatusAndIdNotAndStartTimeLessThanAndEndTimeGreaterThan(
                    r.getSpace(), r.getReservationDate(), ReservationStatus.PENDIENTE, r.getId(),
                    r.getEndTime(), r.getStartTime());
        } else {
            overlapping = reservationRepository.findByEquipmentAndReservationDateAndStatusAndIdNotAndStartTimeLessThanAndEndTimeGreaterThan(
                    r.getEquipment(), r.getReservationDate(), ReservationStatus.PENDIENTE, r.getId(),
                    r.getEndTime(), r.getStartTime());
        }

        for (Reservation pending : overlapping) {
            pending.setStatus(ReservationStatus.RECHAZADA);
            pending.setAdminComment(autoRejectMessage);
            reservationRepository.save(pending);

            // Notificar por email al solicitante rechazado
            String pendingEndDate = pending.getEndDate() != null ? pending.getEndDate().toString() : pending.getReservationDate().toString();
            try {
                emailService.sendReservationRejectedEmail(
                        pending.getRequester().getEmail(), resourceName,
                        pending.getReservationDate().toString(), pendingEndDate,
                        pending.getStartTime().toString(), pending.getEndTime().toString(),
                        autoRejectMessage);
            } catch (Exception e) { }
        }

        // Notificar al solicitante aprobado
        String endDateStr = r.getEndDate() != null ? r.getEndDate().toString() : r.getReservationDate().toString();
        try {
            emailService.sendReservationApprovedEmail(r.getRequester().getEmail(), resourceName,
                    r.getReservationDate().toString(), endDateStr,
                    r.getStartTime().toString(), r.getEndTime().toString());
        } catch (Exception e) { }
    }

    @Transactional
    public void rejectReservation(Long id, String adminComment) {
        Reservation r = getEntity(id);
        if (r.getStatus() != ReservationStatus.PENDIENTE) throw new RuntimeException("La reserva ya no se puede rechazar");
        if (adminComment == null || adminComment.isBlank()) throw new RuntimeException("Debe proporcionar un motivo de rechazo");
        r.setStatus(ReservationStatus.RECHAZADA);
        r.setAdminComment(normalizeText(adminComment));
        reservationRepository.save(r);
        String rn = r.getResourceType() == ReservationResourceType.SPACE ? r.getSpace().getName() : r.getEquipment().getName();
        String endDateStr = r.getEndDate() != null ? r.getEndDate().toString() : r.getReservationDate().toString();
        try {
            emailService.sendReservationRejectedEmail(r.getRequester().getEmail(), rn,
                    r.getReservationDate().toString(), endDateStr,
                    r.getStartTime().toString(), r.getEndTime().toString(),
                    r.getAdminComment());
        } catch (Exception e) { }
    }

    @Transactional
    public void returnReservation(Long id, ReturnReservationRequest request) {
        Reservation r = getEntity(id);
        if (r.getStatus() != ReservationStatus.APROBADA) throw new RuntimeException("Solo se pueden devolver reservas aprobadas");
        if (request.getReturnCondition() == null || request.getReturnCondition().isBlank()) throw new RuntimeException("Debe indicar el estado de devolución");
        r.setStatus(ReservationStatus.DEVUELTA);
        r.setReturnCondition(request.getReturnCondition().trim());
        r.setReturnDescription(normalizeNullableText(request.getReturnDescription()));
        r.setReturnedAt(LocalDateTime.now());
        reservationRepository.save(r);
    }

    @Transactional
    public void cancelReservation(Long id) {
        Reservation r = getEntity(id);
        if (r.getStatus() == ReservationStatus.RECHAZADA || r.getStatus() == ReservationStatus.CANCELADA || r.getStatus() == ReservationStatus.DEVUELTA)
            throw new RuntimeException("La reserva ya no se puede cancelar");
        r.setStatus(ReservationStatus.CANCELADA);
        reservationRepository.save(r);
    }

    @Transactional(readOnly = true)
    public List<ReservationListItemResponse> getReservationsBySpaceId(Long spaceId) {
        return reservationRepository.findBySpaceIdOrderByReservationDateDesc(spaceId).stream().map(this::toListResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ReservationListItemResponse> getReservationsByEquipmentId(Long equipmentId) {
        return reservationRepository.findByEquipmentIdOrderByReservationDateDesc(equipmentId).stream().map(this::toListResponse).toList();
    }

    @Transactional(readOnly = true)
    public Page<ReservationListItemResponse> getAuditRecords(int page, int size, String filter) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        List<ReservationStatus> as = List.of(ReservationStatus.APROBADA, ReservationStatus.RECHAZADA, ReservationStatus.CANCELADA, ReservationStatus.DEVUELTA);
        Page<Reservation> rp;
        if (filter != null && !filter.isBlank()) {
            switch (filter.toUpperCase()) {
                case "SPACE" -> rp = reservationRepository.findByStatusInAndResourceType(as, ReservationResourceType.SPACE, pageable);
                case "EQUIPMENT" -> rp = reservationRepository.findByStatusInAndResourceType(as, ReservationResourceType.EQUIPMENT, pageable);
                case "APROBADA" -> rp = reservationRepository.findByStatus(ReservationStatus.APROBADA, pageable);
                case "RECHAZADA" -> rp = reservationRepository.findByStatus(ReservationStatus.RECHAZADA, pageable);
                case "CANCELADA" -> rp = reservationRepository.findByStatus(ReservationStatus.CANCELADA, pageable);
                case "DEVUELTA" -> rp = reservationRepository.findByStatus(ReservationStatus.DEVUELTA, pageable);
                default -> rp = reservationRepository.findByStatusIn(as, pageable);
            }
        } else { rp = reservationRepository.findByStatusIn(as, pageable); }
        return rp.map(this::toListResponse);
    }

    @Transactional(readOnly = true)
    public Page<ReservationListItemResponse> getMyReservations(Long userId, int page, int size, String filter) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Reservation> rp;
        if (filter != null && !filter.isBlank()) {
            switch (filter.toUpperCase()) {
                case "PENDIENTE" -> rp = reservationRepository.findByRequesterIdAndStatus(userId, ReservationStatus.PENDIENTE, pageable);
                case "APROBADA" -> rp = reservationRepository.findByRequesterIdAndStatus(userId, ReservationStatus.APROBADA, pageable);
                case "RECHAZADA" -> rp = reservationRepository.findByRequesterIdAndStatus(userId, ReservationStatus.RECHAZADA, pageable);
                case "CANCELADA" -> rp = reservationRepository.findByRequesterIdAndStatus(userId, ReservationStatus.CANCELADA, pageable);
                case "DEVUELTA" -> rp = reservationRepository.findByRequesterIdAndStatus(userId, ReservationStatus.DEVUELTA, pageable);
                default -> rp = reservationRepository.findByRequesterId(userId, pageable);
            }
        } else { rp = reservationRepository.findByRequesterId(userId, pageable); }
        return rp.map(this::toListResponse);
    }

    @Transactional(readOnly = true)
    public ReservationDetailResponse getMyReservationById(Long id, Long userId) {
        Reservation r = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        if (!r.getRequester().getId().equals(userId)) throw new RuntimeException("No autorizado");
        return toDetailResponse(r);
    }

    @Transactional
    public void updateMyReservation(Long id, Long userId, CreateReservationRequest request) {
        Reservation r = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        if (!r.getRequester().getId().equals(userId)) throw new RuntimeException("No autorizado");
        if (r.getStatus() != ReservationStatus.PENDIENTE) throw new RuntimeException("Solo puedes editar solicitudes pendientes");
        if (request.getReservationDate().isBefore(LocalDate.now())) throw new RuntimeException("Fecha de reserva no válida");

        LocalDate endDate = request.getEndDate() != null ? request.getEndDate() : request.getReservationDate();
        if (endDate.isBefore(request.getReservationDate())) throw new RuntimeException("La fecha de fin no puede ser antes de la de inicio");
        if (request.getReservationDate().equals(endDate) && !request.getEndTime().isAfter(request.getStartTime())) throw new RuntimeException("Horario no válido");

        List<ReservationStatus> bs = List.of(ReservationStatus.APROBADA);
        if (r.getResourceType() == ReservationResourceType.SPACE) {
            boolean ov = reservationRepository.existsBySpaceAndReservationDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(r.getSpace(), request.getReservationDate(), bs, request.getEndTime(), request.getStartTime());
            if (ov) throw new RuntimeException("Horario no disponible");
        } else {
            boolean ov = reservationRepository.existsByEquipmentAndReservationDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(r.getEquipment(), request.getReservationDate(), bs, request.getEndTime(), request.getStartTime());
            if (ov) throw new RuntimeException("Horario no disponible");
        }
        r.setReservationDate(request.getReservationDate());
        r.setStartTime(request.getStartTime());
        r.setEndDate(endDate);
        r.setEndTime(request.getEndTime());
        r.setPurpose(normalizeText(request.getPurpose()));
        r.setObservations(normalizeNullableText(request.getObservations()));
        reservationRepository.save(r);
    }

    @Transactional
    public void cancelMyReservation(Long id, Long userId) {
        Reservation r = reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        if (!r.getRequester().getId().equals(userId)) throw new RuntimeException("No autorizado");
        if (r.getStatus() != ReservationStatus.PENDIENTE) throw new RuntimeException("Solo puedes cancelar solicitudes pendientes");
        r.setStatus(ReservationStatus.CANCELADA);
        reservationRepository.save(r);
    }

    private Reservation getEntity(Long id) {
        return reservationRepository.findById(id).orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
    }

    private String normalizeText(String v) { return v == null ? "" : v.trim().replaceAll("\\s{2,}", " "); }
    private String normalizeNullableText(String v) { if (v == null) return null; String c = v.trim().replaceAll("\\s{2,}", " "); return c.isBlank() ? null : c; }

    private ReservationListItemResponse toListResponse(Reservation r) {
        String rn = r.getResourceType() == ReservationResourceType.SPACE ? r.getSpace().getName() : r.getEquipment().getName();
        String ed = r.getEndDate() != null ? r.getEndDate().toString() : r.getReservationDate().toString();
        return ReservationListItemResponse.builder()
                .id(r.getId()).requesterName(r.getRequester().getName() + " " + r.getRequester().getLastName())
                .requesterType(r.getRequester().getUserType()).resourceType(r.getResourceType().name())
                .resourceName(rn).reservationDate(r.getReservationDate().toString())
                .endDate(ed).schedule(r.getStartTime() + " - " + r.getEndTime())
                .status(r.getStatus().name()).build();
    }

    private ReservationDetailResponse toDetailResponse(Reservation r) {
        String rn = r.getResourceType() == ReservationResourceType.SPACE ? r.getSpace().getName() : r.getEquipment().getName();
        String ed = r.getEndDate() != null ? r.getEndDate().toString() : r.getReservationDate().toString();
        return ReservationDetailResponse.builder()
                .id(r.getId()).requesterName(r.getRequester().getName() + " " + r.getRequester().getLastName())
                .requesterEmail(r.getRequester().getEmail()).requesterType(r.getRequester().getUserType())
                .resourceType(r.getResourceType().name()).resourceName(rn)
                .reservationDate(r.getReservationDate().toString()).startTime(r.getStartTime().toString())
                .endDate(ed).endTime(r.getEndTime().toString())
                .purpose(r.getPurpose()).observations(r.getObservations())
                .status(r.getStatus().name()).adminComment(r.getAdminComment())
                .returnCondition(r.getReturnCondition()).returnDescription(r.getReturnDescription())
                .returnedAt(r.getReturnedAt() != null ? r.getReturnedAt().toString() : null).build();
    }
}