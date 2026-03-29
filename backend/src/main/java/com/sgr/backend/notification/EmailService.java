package com.sgr.backend.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Recuperación de contraseña");
        message.setText(
                "Tu código de recuperación es: " + code + ". Expira en 15 minutos."
        );
        mailSender.send(message);
    }

    public void sendRequestApprovedEmail(String to, String requestTitle) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Estado de tu solicitud");
        message.setText("Tu petición sobre: " + requestTitle + " fue aceptada.");
        mailSender.send(message);
    }

    public void sendRequestRejectedEmail(String to, String requestTitle) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Estado de tu solicitud");
        message.setText("Tu petición sobre: " + requestTitle + " fue rechazada.");
        mailSender.send(message);
    }
}