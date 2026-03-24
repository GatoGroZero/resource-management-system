package com.sgr.backend.notification;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendOtpEmail(String to, String code) {
        System.out.println("=================================");
        System.out.println("EMAIL SIMULADO - OTP");
        System.out.println("Para: " + to);
        System.out.println("OTP: " + code);
        System.out.println("=================================");
    }

    public void sendRequestApprovedEmail(String to, String requestTitle) {
        System.out.println("=================================");
        System.out.println("EMAIL SIMULADO - SOLICITUD APROBADA");
        System.out.println("Para: " + to);
        System.out.println("Mensaje: Tu petición sobre: " + requestTitle + " fue aceptada.");
        System.out.println("=================================");
    }

    public void sendRequestRejectedEmail(String to, String requestTitle) {
        System.out.println("=================================");
        System.out.println("EMAIL SIMULADO - SOLICITUD RECHAZADA");
        System.out.println("Para: " + to);
        System.out.println("Mensaje: Tu petición sobre: " + requestTitle + " fue rechazada.");
        System.out.println("=================================");
    }
}