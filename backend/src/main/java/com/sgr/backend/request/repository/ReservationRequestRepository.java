package com.sgr.backend.request.repository;

import com.sgr.backend.request.entity.ReservationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRequestRepository extends JpaRepository<ReservationRequest, Long> {
}