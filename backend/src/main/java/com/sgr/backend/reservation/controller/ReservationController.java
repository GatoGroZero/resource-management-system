package com.sgr.backend.reservation.controller;

import com.sgr.backend.reservation.dto.*;
import com.sgr.backend.reservation.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<Page<ReservationListItemResponse>> getReservations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String filter
    ) { return ResponseEntity.ok(reservationService.getReservations(page, size, filter)); }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationDetailResponse> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @GetMapping("/options")
    public ResponseEntity<ReservationFormOptionsResponse> getOptions() {
        return ResponseEntity.ok(reservationService.getFormOptions());
    }

    @GetMapping("/by-space/{spaceId}")
    public ResponseEntity<List<ReservationListItemResponse>> getBySpace(@PathVariable Long spaceId) {
        return ResponseEntity.ok(reservationService.getReservationsBySpaceId(spaceId));
    }

    @GetMapping("/by-equipment/{equipmentId}")
    public ResponseEntity<List<ReservationListItemResponse>> getByEquipment(@PathVariable Long equipmentId) {
        return ResponseEntity.ok(reservationService.getReservationsByEquipmentId(equipmentId));
    }

    @GetMapping("/audit")
    public ResponseEntity<Page<ReservationListItemResponse>> getAuditRecords(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String filter
    ) { return ResponseEntity.ok(reservationService.getAuditRecords(page, size, filter)); }

    @GetMapping("/my")
    public ResponseEntity<Page<ReservationListItemResponse>> getMyReservations(
            @RequestParam Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String filter
    ) { return ResponseEntity.ok(reservationService.getMyReservations(userId, page, size, filter)); }

    @GetMapping("/my/{id}")
    public ResponseEntity<ReservationDetailResponse> getMyReservationById(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(reservationService.getMyReservationById(id, userId));
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@Valid @RequestBody CreateReservationRequest request) {
        reservationService.createReservation(request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<?> approveReservation(@PathVariable Long id, @RequestBody(required = false) ReservationActionRequest request) {
        reservationService.approveReservation(id, request != null ? request.getAdminComment() : null);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<?> rejectReservation(@PathVariable Long id, @Valid @RequestBody ReservationActionRequest request) {
        reservationService.rejectReservation(id, request.getAdminComment());
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/return")
    public ResponseEntity<?> returnReservation(@PathVariable Long id, @Valid @RequestBody ReturnReservationRequest request) {
        reservationService.returnReservation(id, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/my/{id}")
    public ResponseEntity<?> updateMyReservation(@PathVariable Long id, @RequestParam Long userId, @Valid @RequestBody CreateReservationRequest request) {
        reservationService.updateMyReservation(id, userId, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/my/{id}/cancel")
    public ResponseEntity<?> cancelMyReservation(@PathVariable Long id, @RequestParam Long userId) {
        reservationService.cancelMyReservation(id, userId);
        return ResponseEntity.ok().build();
    }
}