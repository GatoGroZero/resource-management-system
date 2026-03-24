package com.sgr.backend.notification;

import org.springframework.stereotype.Service;

@Service
public class EmailService {

    public void sendOtpEmail(String to, String code) {
        System.out.println("=================================");
        System.out.println("EMAIL SIMULADO");
        System.out.println("Para: " + to);
        System.out.println("OTP: " + code);
        System.out.println("=================================");
    }
}