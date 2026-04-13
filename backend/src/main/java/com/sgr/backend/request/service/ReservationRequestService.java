package com.sgr.backend.request.service;

import com.sgr.backend.notification.EmailService;
import com.sgr.backend.request.dto.CreateRequestRequest;
import com.sgr.backend.request.dto.RequestDecisionRequest;
import com.sgr.backend.request.entity.ReservationRequest;
import com.sgr.backend.request.enums.RequestStatus;
import com.sgr.backend.request.repository.ReservationRequestRepository;
import com.sgr.backend.user.entity.User;
import com.sgr.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationRequestService {

    private final ReservationRequestRepository reservationRequestRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public ReservationRequest create(CreateRequestRequest request) {
        User requester = userRepository.findByEmail(request.getRequesterEmail()).orElseThrow(() -> new RuntimeException("Solicitante no encontrado"));
        ReservationRequest reservationRequest = ReservationRequest.builder().title(request.getTitle()).description(request.getDescription()).status(RequestStatus.PENDING).requester(requester).createdAt(LocalDateTime.now()).build();
        return reservationRequestRepository.save(reservationRequest);
    }

    @Transactional(readOnly = true)
    public List<ReservationRequest> findAll() {
        return reservationRequestRepository.findAll();
    }

    @Transactional
    public ReservationRequest approve(Long id, RequestDecisionRequest request) {
        ReservationRequest reservationRequest = reservationRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        User admin = userRepository.findByEmail(request.getAdminEmail()).orElseThrow(() -> new RuntimeException("Admin no encontrado"));
        reservationRequest.setStatus(RequestStatus.APPROVED); reservationRequest.setResponseMessage(request.getResponseMessage()); reservationRequest.setReviewedBy(admin); reservationRequest.setReviewedAt(LocalDateTime.now());
        ReservationRequest saved = reservationRequestRepository.save(reservationRequest);
        emailService.sendRequestApprovedEmail(saved.getRequester().getEmail(), saved.getTitle());
        return saved;
    }

    @Transactional
    public ReservationRequest reject(Long id, RequestDecisionRequest request) {
        ReservationRequest reservationRequest = reservationRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        User admin = userRepository.findByEmail(request.getAdminEmail()).orElseThrow(() -> new RuntimeException("Admin no encontrado"));
        reservationRequest.setStatus(RequestStatus.REJECTED); reservationRequest.setResponseMessage(request.getResponseMessage()); reservationRequest.setReviewedBy(admin); reservationRequest.setReviewedAt(LocalDateTime.now());
        ReservationRequest saved = reservationRequestRepository.save(reservationRequest);
        emailService.sendRequestRejectedEmail(saved.getRequester().getEmail(), saved.getTitle());
        return saved;
    }
}