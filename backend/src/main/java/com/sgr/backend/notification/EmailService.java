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
        message.setText("Tu código de recuperación es: " + code + ". Expira en 15 minutos.");
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

    public void sendReservationCreatedEmail(String to, String resourceName, String date, String startTime, String endTime) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Solicitud de reservación registrada");
        message.setText(
                "Tu solicitud de reservación ha sido registrada correctamente.\n\n" +
                        "Recurso: " + resourceName + "\n" +
                        "Fecha: " + date + "\n" +
                        "Horario: " + startTime + " - " + endTime + "\n\n" +
                        "Estado: PENDIENTE\n" +
                        "Un administrador revisará tu solicitud próximamente."
        );
        mailSender.send(message);
    }

    public void sendReservationApprovedEmail(String to, String resourceName, String date, String startTime, String endTime) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Reservación aprobada");
        message.setText(
                "Tu reservación ha sido APROBADA.\n\n" +
                        "Recurso: " + resourceName + "\n" +
                        "Fecha: " + date + "\n" +
                        "Horario: " + startTime + " - " + endTime + "\n\n" +
                        "Recuerda presentarte puntualmente."
        );
        mailSender.send(message);
    }

    public void sendReservationRejectedEmail(String to, String resourceName, String date, String adminComment) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Reservación rechazada");
        message.setText(
                "Tu reservación ha sido RECHAZADA.\n\n" +
                        "Recurso: " + resourceName + "\n" +
                        "Fecha: " + date + "\n" +
                        (adminComment != null && !adminComment.isBlank()
                                ? "Motivo: " + adminComment + "\n\n"
                                : "\n") +
                        "Puedes realizar una nueva solicitud si lo necesitas."
        );
        mailSender.send(message);
    }
}