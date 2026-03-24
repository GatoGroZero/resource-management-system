package com.sgr.backend.auth.service;

import com.sgr.backend.auth.dto.LoginRequest;
import com.sgr.backend.auth.dto.LoginResponse;
import com.sgr.backend.auth.entity.PasswordResetOtp;
import com.sgr.backend.auth.repository.PasswordResetOtpRepository;
import com.sgr.backend.notification.EmailService;
import com.sgr.backend.security.JwtService;
import com.sgr.backend.user.entity.User;
import com.sgr.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final UserDetailsService userDetailsService;
    private final PasswordResetOtpRepository otpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Credenciales inválidas"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return LoginResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        otpRepository.findTopByUserAndUsedFalseOrderByIdDesc(user)
                .ifPresent(existingOtp -> {
                    existingOtp.setUsed(true);
                    otpRepository.save(existingOtp);
                });

        String code = String.format("%06d", new Random().nextInt(1_000_000));

        PasswordResetOtp otp = PasswordResetOtp.builder()
                .code(code)
                .user(user)
                .used(false)
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .build();

        otpRepository.save(otp);
        emailService.sendOtpEmail(user.getEmail(), code);
    }

    public void verifyOtp(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        PasswordResetOtp otp = otpRepository.findTopByUserAndUsedFalseOrderByIdDesc(user)
                .orElseThrow(() -> new RuntimeException("Código inválido"));

        if (!otp.getCode().equals(code)) {
            throw new RuntimeException("Código incorrecto");
        }

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Código expirado");
        }
    }

    public void resetPassword(String email, String code, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        PasswordResetOtp otp = otpRepository.findTopByUserAndUsedFalseOrderByIdDesc(user)
                .orElseThrow(() -> new RuntimeException("Código inválido"));

        if (!otp.getCode().equals(code)) {
            throw new RuntimeException("Código incorrecto");
        }

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Código expirado");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        otp.setUsed(true);
        otpRepository.save(otp);
    }
}