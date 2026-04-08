package com.sgr.backend.equipment.controller;

import com.sgr.backend.equipment.dto.CreateEquipmentRequest;
import com.sgr.backend.equipment.dto.EquipmentDetailResponse;
import com.sgr.backend.equipment.dto.EquipmentListItemResponse;
import com.sgr.backend.equipment.dto.UpdateEquipmentRequest;
import com.sgr.backend.equipment.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/equipments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EquipmentController {

    private final EquipmentService equipmentService;

    @GetMapping
    public ResponseEntity<Page<EquipmentListItemResponse>> getEquipments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(equipmentService.getEquipments(page, size, filter, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentDetailResponse> getEquipmentById(@PathVariable Long id) {
        return ResponseEntity.ok(equipmentService.getEquipmentById(id));
    }

    @PostMapping
    public ResponseEntity<?> createEquipment(@Valid @RequestBody CreateEquipmentRequest request) {
        equipmentService.createEquipment(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEquipment(@PathVariable Long id, @Valid @RequestBody UpdateEquipmentRequest request) {
        equipmentService.updateEquipment(id, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleEquipmentStatus(@PathVariable Long id) {
        equipmentService.toggleEquipmentStatus(id);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/by-space/{spaceId}")
    public ResponseEntity<List<EquipmentListItemResponse>> getBySpace(@PathVariable Long spaceId) {
        return ResponseEntity.ok(equipmentService.getEquipmentsBySpaceId(spaceId));
    }
}