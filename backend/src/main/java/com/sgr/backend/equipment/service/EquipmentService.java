package com.sgr.backend.equipment.service;

import com.sgr.backend.equipment.dto.CreateEquipmentRequest;
import com.sgr.backend.equipment.dto.EquipmentDetailResponse;
import com.sgr.backend.equipment.dto.EquipmentListItemResponse;
import com.sgr.backend.equipment.dto.UpdateEquipmentRequest;
import com.sgr.backend.equipment.entity.Equipment;
import com.sgr.backend.equipment.entity.EquipmentCondition;
import com.sgr.backend.equipment.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;

    public Page<EquipmentListItemResponse> getEquipments(int page, int size, String filter, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());

        Page<Equipment> equipmentsPage;

        if (search != null && !search.isBlank()) {
            String cleanSearch = search.trim().replaceAll("\\s{2,}", " ");
            equipmentsPage = equipmentRepository.findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(
                    cleanSearch, cleanSearch, pageable
            );
        } else if (filter != null && !filter.isBlank()) {
            switch (filter.toUpperCase()) {
                case "DISPONIBLE" -> equipmentsPage = equipmentRepository.findByCondition(EquipmentCondition.DISPONIBLE, pageable);
                case "EN_USO" -> equipmentsPage = equipmentRepository.findByCondition(EquipmentCondition.EN_USO, pageable);
                case "MANTENIMIENTO" -> equipmentsPage = equipmentRepository.findByCondition(EquipmentCondition.MANTENIMIENTO, pageable);
                case "AUDIOVISUAL" -> equipmentsPage = equipmentRepository.findByCategoryIgnoreCase("Audiovisual", pageable);
                case "COMPUTO" -> equipmentsPage = equipmentRepository.findByCategoryIgnoreCase("Cómputo", pageable);
                case "LABORATORIO" -> equipmentsPage = equipmentRepository.findByCategoryIgnoreCase("Laboratorio", pageable);
                case "Q_SMALL" -> equipmentsPage = equipmentRepository.findByQuantityBetween(1, 10, pageable);
                case "Q_MEDIUM" -> equipmentsPage = equipmentRepository.findByQuantityBetween(11, 50, pageable);
                case "Q_LARGE" -> equipmentsPage = equipmentRepository.findByQuantityBetween(51, 10000, pageable);
                default -> equipmentsPage = equipmentRepository.findAll(pageable);
            }
        } else {
            equipmentsPage = equipmentRepository.findAll(pageable);
        }

        return equipmentsPage.map(this::toListResponse);
    }

    public EquipmentDetailResponse getEquipmentById(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        return toDetailResponse(equipment);
    }

    public void createEquipment(CreateEquipmentRequest request) {
        String name = normalizeText(request.getName());
        String category = normalizeText(request.getCategory());
        String code = normalizeCompact(request.getCode());
        String description = normalizeText(request.getDescription());

        validateCommon(name, category, code, request.getQuantity(), description, request.getAllowStudents(), request.getCondition());

        if (equipmentRepository.existsByCodeIgnoreCase(code)) {
            throw new RuntimeException("Código no válido");
        }

        Equipment equipment = Equipment.builder()
                .name(name)
                .category(category)
                .code(code)
                .quantity(request.getQuantity())
                .description(description)
                .allowStudents(request.getAllowStudents())
                .active(request.getActive() != null ? request.getActive() : true)
                .condition(request.getCondition())
                .createdAt(LocalDateTime.now())
                .build();

        equipmentRepository.save(equipment);
    }

    public void updateEquipment(Long id, UpdateEquipmentRequest request) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        String name = normalizeText(request.getName());
        String category = normalizeText(request.getCategory());
        String code = normalizeCompact(request.getCode());
        String description = normalizeText(request.getDescription());

        validateCommon(name, category, code, request.getQuantity(), description, request.getAllowStudents(), request.getCondition());

        if (equipmentRepository.existsByCodeIgnoreCaseAndIdNot(code, id)) {
            throw new RuntimeException("Código no válido");
        }

        equipment.setName(name);
        equipment.setCategory(category);
        equipment.setCode(code);
        equipment.setQuantity(request.getQuantity());
        equipment.setDescription(description);
        equipment.setAllowStudents(request.getAllowStudents());
        equipment.setActive(request.getActive() != null ? request.getActive() : equipment.getActive());
        equipment.setCondition(request.getCondition());

        equipmentRepository.save(equipment);
    }

    public void toggleEquipmentStatus(Long id) {
        Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        equipment.setActive(!equipment.getActive());
        equipmentRepository.save(equipment);
    }

    private void validateCommon(
            String name,
            String category,
            String code,
            Integer quantity,
            String description,
            Boolean allowStudents,
            EquipmentCondition condition
    ) {
        if (name.isBlank() || category.isBlank() || code.isBlank() || quantity == null
                || description.isBlank() || allowStudents == null || condition == null) {
            throw new RuntimeException("Datos inválidos");
        }

        if (name.length() < 3 || category.length() < 3) {
            throw new RuntimeException("Datos inválidos");
        }

        if (description.length() < 10 || description.length() > 500) {
            throw new RuntimeException("Descripción no válida");
        }

        if (quantity < 1 || quantity > 10000) {
            throw new RuntimeException("Cantidad no válida");
        }
    }

    private String normalizeText(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s{2,}", " ");
    }

    private String normalizeCompact(String value) {
        return value == null ? "" : value.replaceAll("\\s+", "");
    }

    private EquipmentListItemResponse toListResponse(Equipment equipment) {
        return EquipmentListItemResponse.builder()
                .id(equipment.getId())
                .name(equipment.getName())
                .category(equipment.getCategory())
                .code(equipment.getCode())
                .quantity(equipment.getQuantity())
                .description(equipment.getDescription())
                .allowStudents(equipment.getAllowStudents())
                .active(equipment.getActive())
                .condition(equipment.getCondition().name())
                .build();
    }

    private EquipmentDetailResponse toDetailResponse(Equipment equipment) {
        return EquipmentDetailResponse.builder()
                .id(equipment.getId())
                .name(equipment.getName())
                .category(equipment.getCategory())
                .code(equipment.getCode())
                .quantity(equipment.getQuantity())
                .description(equipment.getDescription())
                .allowStudents(equipment.getAllowStudents())
                .active(equipment.getActive())
                .condition(equipment.getCondition().name())
                .build();
    }
}