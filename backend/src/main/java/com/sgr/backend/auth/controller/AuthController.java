package com.sgr.backend.auth.controller;

import com.sgr.backend.auth.dto.ForgotPasswordRequest;
import com.sgr.backend.auth.dto.LoginRequest;
import com.sgr.backend.auth.dto.LoginResponse;
import com.sgr.backend.auth.dto.ResetPasswordRequest;
import com.sgr.backend.auth.dto.VerifyOtpRequest;
import com.sgr.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok("Código enviado al correo");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        authService.verifyOtp(request.getEmail(), request.getCode());
        return ResponseEntity.ok("Código válido");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(
                request.getEmail(),
                request.getCode(),
                request.getNewPassword()
        );
        return ResponseEntity.ok("Contraseña actualizada");
    }
}