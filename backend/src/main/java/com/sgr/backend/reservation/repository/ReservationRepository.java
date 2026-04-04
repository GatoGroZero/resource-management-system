package com.sgr.backend.reservation.repository;

import com.sgr.backend.equipment.entity.Equipment;
import com.sgr.backend.reservation.entity.Reservation;
import com.sgr.backend.reservation.entity.ReservationResourceType;
import com.sgr.backend.reservation.entity.ReservationStatus;
import com.sgr.backend.space.entity.Space;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    Page<Reservation> findByStatus(ReservationStatus status, Pageable pageable);

    Page<Reservation> findByResourceType(ReservationResourceType resourceType, Pageable pageable);

    List<Reservation> findBySpaceIdOrderByReservationDateDesc(Long spaceId);

    List<Reservation> findByEquipmentIdOrderByReservationDateDesc(Long equipmentId);

    long countByStatus(ReservationStatus status);

    boolean existsBySpaceAndReservationDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
            Space space,
            LocalDate reservationDate,
            List<ReservationStatus> statuses,
            LocalTime endTime,
            LocalTime startTime
    );

    boolean existsByEquipmentAndReservationDateAndStatusInAndStartTimeLessThanAndEndTimeGreaterThan(
            Equipment equipment,
            LocalDate reservationDate,
            List<ReservationStatus> statuses,
            LocalTime endTime,
            LocalTime startTime
    );

    Page<Reservation> findByStatusIn(List<ReservationStatus> statuses, Pageable pageable);

    Page<Reservation> findByStatusInAndResourceType(List<ReservationStatus> statuses, ReservationResourceType resourceType, Pageable pageable);

    Page<Reservation> findByStatusInAndStatus(List<ReservationStatus> statusList, ReservationStatus status, Pageable pageable);
    Page<Reservation> findByRequesterId(Long requesterId, Pageable pageable);

    Page<Reservation> findByRequesterIdAndStatus(Long requesterId, ReservationStatus status, Pageable pageable);

    
}