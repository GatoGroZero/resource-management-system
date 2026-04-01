package com.sgr.backend.user.service;

import com.sgr.backend.common.enums.Role;
import com.sgr.backend.user.dto.CreateUserRequest;
import com.sgr.backend.user.dto.UpdateProfileRequest;
import com.sgr.backend.user.dto.UpdateUserRequest;
import com.sgr.backend.user.dto.UserDetailResponse;
import com.sgr.backend.user.dto.UserListItemResponse;
import com.sgr.backend.user.entity.User;
import com.sgr.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final Pattern UTEZ_EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9._%+-]+@utez\\.edu\\.mx$");
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\d{10}$");
    private static final Pattern NAME_PATTERN = Pattern.compile("^[A-Za-záéíóúÁÉÍÓÚñÑ]+( [A-Za-záéíóúÁÉÍÓÚñÑ]+)?$");
    private static final Pattern IDENTIFIER_PATTERN = Pattern.compile("^\\S+$");

    public Page<UserListItemResponse> getUsers(int page, int size, String filter, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());

        Page<User> usersPage;

        if (search != null && !search.isBlank()) {
            String cleanSearch = cleanSearch(search);
            usersPage = userRepository
                    .findByNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrIdentifierContainingIgnoreCase(
                            cleanSearch, cleanSearch, cleanSearch, pageable
                    );
        } else if (filter != null && !filter.isBlank()) {
            switch (filter.toUpperCase()) {
                case "ADMIN" -> usersPage = userRepository.findByRole(Role.ADMIN, pageable);
                case "STUDENTS" -> usersPage = userRepository.findByRole(Role.STUDENT, pageable);
                case "STAFF" -> usersPage = userRepository.findByRole(Role.STAFF, pageable);
                case "ACTIVE" -> usersPage = userRepository.findByActive(true, pageable);
                case "INACTIVE" -> usersPage = userRepository.findByActive(false, pageable);
                default -> usersPage = userRepository.findAll(pageable);
            }
        } else {
            usersPage = userRepository.findAll(pageable);
        }

        return usersPage.map(this::toListResponse);
    }

    public UserDetailResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return toDetailResponse(user);
    }

    public void createUser(CreateUserRequest request) {
        SanitizedUserData data = sanitizeAndValidate(
                request.getName(),
                request.getLastName(),
                request.getEmail(),
                request.getIdentifier(),
                request.getBirthDate(),
                request.getUserType(),
                request.getPhone(),
                request.getRole(),
                request.getPassword(),
                true
        );

        if (userRepository.existsByEmail(data.email())) {
            throw new RuntimeException("Correo no válido");
        }

        if (userRepository.existsByIdentifier(data.identifier())) {
            throw new RuntimeException("Matrícula o número de empleado no válido");
        }

        User user = User.builder()
                .name(data.name())
                .lastName(data.lastName())
                .email(data.email())
                .identifier(data.identifier())
                .password(passwordEncoder.encode(data.password()))
                .role(data.role())
                .active(request.getActive() != null ? request.getActive() : true)
                .birthDate(data.birthDate())
                .userType(data.userType())
                .phone(data.phone())
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
    }

    public void updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        SanitizedUserData data = sanitizeAndValidate(
                request.getName(),
                request.getLastName(),
                request.getEmail(),
                request.getIdentifier(),
                request.getBirthDate(),
                request.getUserType(),
                request.getPhone(),
                request.getRole(),
                request.getPassword(),
                false
        );

        if (userRepository.existsByEmailAndIdNot(data.email(), id)) {
            throw new RuntimeException("Correo no válido");
        }

        if (userRepository.existsByIdentifierAndIdNot(data.identifier(), id)) {
            throw new RuntimeException("Matrícula o número de empleado no válido");
        }

        user.setName(data.name());
        user.setLastName(data.lastName());
        user.setEmail(data.email());
        user.setIdentifier(data.identifier());
        user.setRole(data.role());
        user.setActive(request.getActive() != null ? request.getActive() : user.getActive());
        user.setBirthDate(data.birthDate());
        user.setUserType(data.userType());
        user.setPhone(data.phone());

        if (data.password() != null && !data.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(data.password()));
        }

        userRepository.save(user);
    }

    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (user.getRole() == Role.ADMIN) {
            throw new RuntimeException("No se puede desactivar un administrador");
        }

        user.setActive(!user.getActive());
        userRepository.save(user);
    }

    public void updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim().replaceAll("\\s{2,}", " "));
        }

        if (request.getLastName() != null && !request.getLastName().isBlank()) {
            user.setLastName(request.getLastName().trim().replaceAll("\\s{2,}", " "));
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone().trim());
        }

        userRepository.save(user);
    }

    private SanitizedUserData sanitizeAndValidate(
            String rawName,
            String rawLastName,
            String rawEmail,
            String rawIdentifier,
            LocalDate birthDate,
            String rawUserType,
            String rawPhone,
            Role role,
            String rawPassword,
            boolean passwordRequired
    ) {
        String name = normalizeHumanName(rawName);
        String lastName = normalizeHumanName(rawLastName);
        String email = normalizeCompact(rawEmail).toLowerCase();
        String identifier = normalizeCompact(rawIdentifier);
        String userType = normalizeHumanName(rawUserType);
        String phone = normalizeCompact(rawPhone);
        String password = rawPassword == null ? null : rawPassword;

        if (isBlank(name) || isBlank(lastName)) {
            throw new RuntimeException("Dato inválido en información personal");
        }

        if (!NAME_PATTERN.matcher(name).matches() || !NAME_PATTERN.matcher(lastName).matches()) {
            throw new RuntimeException("Dato inválido en información personal");
        }

        if (birthDate == null) {
            throw new RuntimeException("Año de nacimiento no válido");
        }

        int age = Period.between(birthDate, LocalDate.now()).getYears();
        if (age < 18 || age > 100) {
            throw new RuntimeException("Año de nacimiento no válido");
        }

        if (role == null || isBlank(userType) || isBlank(identifier)) {
            throw new RuntimeException("Datos institucionales están mal");
        }

        if (!IDENTIFIER_PATTERN.matcher(identifier).matches()) {
            throw new RuntimeException("Matrícula o número de empleado no válido");
        }

        if (isBlank(email) || !UTEZ_EMAIL_PATTERN.matcher(email).matches()) {
            throw new RuntimeException("Correo no válido");
        }

        if (isBlank(phone) || !PHONE_PATTERN.matcher(phone).matches()) {
            throw new RuntimeException("Teléfono no válido");
        }

        if (passwordRequired && (password == null || password.isBlank())) {
            throw new RuntimeException("Dato inválido en contacto y seguridad");
        }

        if (role == Role.ADMIN && !"Administrativo".equals(userType)) {
            throw new RuntimeException("Datos institucionales están mal");
        }

        if ((role == Role.STUDENT || role == Role.STAFF)
                && !("Estudiante".equals(userType) || "Personal Académico".equals(userType))) {
            throw new RuntimeException("Datos institucionales están mal");
        }

        return new SanitizedUserData(
                name,
                lastName,
                email,
                identifier,
                birthDate,
                userType,
                phone,
                role,
                password
        );
    }

    private String normalizeHumanName(String value) {
        if (value == null) return "";
        return value.trim().replaceAll("\\s{2,}", " ");
    }

    private String normalizeCompact(String value) {
        if (value == null) return "";
        return value.replaceAll("\\s+", "");
    }

    private String cleanSearch(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s{2,}", " ");
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private UserListItemResponse toListResponse(User user) {
        return UserListItemResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .lastName(user.getLastName())
                .fullName(user.getName() + " " + user.getLastName())
                .email(user.getEmail())
                .identifier(user.getIdentifier())
                .role(user.getRole().name())
                .userType(user.getUserType())
                .phone(user.getPhone())
                .active(user.getActive())
                .build();
    }

    private UserDetailResponse toDetailResponse(User user) {
        return UserDetailResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .identifier(user.getIdentifier())
                .role(user.getRole().name())
                .active(user.getActive())
                .birthDate(user.getBirthDate())
                .userType(user.getUserType())
                .phone(user.getPhone())
                .build();
    }

    private record SanitizedUserData(
            String name,
            String lastName,
            String email,
            String identifier,
            LocalDate birthDate,
            String userType,
            String phone,
            Role role,
            String password
    ) {}
}