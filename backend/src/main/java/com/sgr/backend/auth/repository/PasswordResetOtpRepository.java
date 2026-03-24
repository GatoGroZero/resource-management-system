package com.sgr.backend.auth.repository;

import com.sgr.backend.auth.entity.PasswordResetOtp;
import com.sgr.backend.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {
    Optional<PasswordResetOtp> findTopByUserAndUsedFalseOrderByIdDesc(User user);
}