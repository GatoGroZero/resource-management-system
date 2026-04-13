package com.sgr.backend.request.controller;

import com.sgr.backend.request.dto.CreateRequestRequest;
import com.sgr.backend.request.dto.RequestDecisionRequest;
import com.sgr.backend.request.entity.ReservationRequest;
import com.sgr.backend.request.service.ReservationRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReservationRequestController {

    private final ReservationRequestService reservationRequestService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<ReservationRequest> create(@Valid @RequestBody CreateRequestRequest request) {
        return ResponseEntity.ok(reservationRequestService.create(request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<ReservationRequest>> findAll() {
        return ResponseEntity.ok(reservationRequestService.findAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/approve")
    public ResponseEntity<ReservationRequest> approve(
            @PathVariable Long id,
            @Valid @RequestBody RequestDecisionRequest request
    ) {
        return ResponseEntity.ok(reservationRequestService.approve(id, request));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/reject")
    public ResponseEntity<ReservationRequest> reject(
            @PathVariable Long id,
            @Valid @RequestBody RequestDecisionRequest request
    ) {
        return ResponseEntity.ok(reservationRequestService.reject(id, request));
    }
}