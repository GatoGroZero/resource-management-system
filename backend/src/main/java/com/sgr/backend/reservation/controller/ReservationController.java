package com.sgr.backend.reservation.controller;

import com.sgr.backend.reservation.dto.*;
import com.sgr.backend.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    ) {
        return ResponseEntity.ok(reservationService.getReservations(page, size, filter));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationDetailResponse> getReservationById(@PathVariable Long id) {
        return ResponseEntity.ok(reservationService.getReservationById(id));
    }

    @GetMapping("/options")
    public ResponseEntity<ReservationFormOptionsResponse> getOptions() {
        return ResponseEntity.ok(reservationService.getFormOptions());
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody CreateReservationRequest request) {
        reservationService.createReservation(request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/approve")
    public ResponseEntity<?> approveReservation(@PathVariable Long id, @RequestBody(required = false) ReservationActionRequest request) {
        reservationService.approveReservation(id, request != null ? request.getAdminComment() : null);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<?> rejectReservation(@PathVariable Long id, @RequestBody(required = false) ReservationActionRequest request) {
        reservationService.rejectReservation(id, request != null ? request.getAdminComment() : null);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable Long id) {
        reservationService.cancelReservation(id);
        return ResponseEntity.ok().build();
    }
}