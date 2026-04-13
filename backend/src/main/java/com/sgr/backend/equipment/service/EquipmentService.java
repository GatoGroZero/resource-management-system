package com.sgr.backend.equipment.service;

import com.sgr.backend.equipment.dto.*; import com.sgr.backend.equipment.entity.*; import com.sgr.backend.equipment.repository.EquipmentRepository;
import com.sgr.backend.space.entity.Space; import com.sgr.backend.space.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime; import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final SpaceRepository spaceRepository;

    @Transactional(readOnly = true)
    public Page<EquipmentListItemResponse> getEquipments(int page, int size, String filter, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Equipment> ep;
        if (search != null && !search.isBlank()) { String cs = search.trim().replaceAll("\\s{2,}", " "); ep = equipmentRepository.findByNameContainingIgnoreCaseOrInventoryNumberContainingIgnoreCase(cs, cs, pageable); }
        else if (filter != null && !filter.isBlank()) { switch (filter.toUpperCase()) { case "DISPONIBLE" -> ep = equipmentRepository.findByCondition(EquipmentCondition.DISPONIBLE, pageable); case "EN_USO" -> ep = equipmentRepository.findByCondition(EquipmentCondition.EN_USO, pageable); case "MANTENIMIENTO" -> ep = equipmentRepository.findByCondition(EquipmentCondition.MANTENIMIENTO, pageable); case "AUDIOVISUAL" -> ep = equipmentRepository.findByCategoryIgnoreCase("Audiovisual", pageable); case "COMPUTO" -> ep = equipmentRepository.findByCategoryIgnoreCase("Cómputo", pageable); case "LABORATORIO" -> ep = equipmentRepository.findByCategoryIgnoreCase("Laboratorio", pageable); case "ALUMNOS" -> ep = equipmentRepository.findByAllowStudents(true, pageable); case "RESTRINGIDO" -> ep = equipmentRepository.findByAllowStudents(false, pageable); default -> ep = equipmentRepository.findAll(pageable); } }
        else { ep = equipmentRepository.findAll(pageable); }
        return ep.map(this::toListResponse);
    }

    @Transactional(readOnly = true)
    public EquipmentDetailResponse getEquipmentById(Long id) { return toDetailResponse(equipmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Equipo no encontrado"))); }

    @Transactional
    public void createEquipment(CreateEquipmentRequest request) {
        String inv = normalizeCompact(request.getInventoryNumber()); String name = normalizeText(request.getName()); String cat = normalizeText(request.getCategory()); String desc = normalizeText(request.getDescription());
        validateCommon(inv, name, cat, desc, request.getAllowStudents(), request.getCondition());
        if (equipmentRepository.existsByInventoryNumberIgnoreCase(inv)) throw new RuntimeException("Ya existe un equipo con ese numero de inventario");
        Space space = null; if (request.getSpaceId() != null) space = spaceRepository.findById(request.getSpaceId()).orElseThrow(() -> new RuntimeException("Espacio no encontrado"));
        equipmentRepository.save(Equipment.builder().inventoryNumber(inv).name(name).category(cat).description(desc).allowStudents(request.getAllowStudents()).active(request.getActive() != null ? request.getActive() : true).condition(request.getCondition()).space(space).createdAt(LocalDateTime.now()).build());
    }

    @Transactional
    public void updateEquipment(Long id, UpdateEquipmentRequest request) {
        Equipment eq = equipmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
        String inv = normalizeCompact(request.getInventoryNumber()); String name = normalizeText(request.getName()); String cat = normalizeText(request.getCategory()); String desc = normalizeText(request.getDescription());
        validateCommon(inv, name, cat, desc, request.getAllowStudents(), request.getCondition());
        if (equipmentRepository.existsByInventoryNumberIgnoreCaseAndIdNot(inv, id)) throw new RuntimeException("Ya existe un equipo con ese numero de inventario");
        Space space = null; if (request.getSpaceId() != null) space = spaceRepository.findById(request.getSpaceId()).orElseThrow(() -> new RuntimeException("Espacio no encontrado"));
        eq.setInventoryNumber(inv); eq.setName(name); eq.setCategory(cat); eq.setDescription(desc); eq.setAllowStudents(request.getAllowStudents()); eq.setActive(request.getActive() != null ? request.getActive() : eq.getActive()); eq.setCondition(request.getCondition()); eq.setSpace(space);
        equipmentRepository.save(eq);
    }

    @Transactional
    public void toggleEquipmentStatus(Long id) { Equipment eq = equipmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Equipo no encontrado")); eq.setActive(!eq.getActive()); equipmentRepository.save(eq); }

    @Transactional(readOnly = true)
    public List<EquipmentListItemResponse> getEquipmentsBySpaceId(Long spaceId) { return equipmentRepository.findBySpaceIdAndActiveTrue(spaceId).stream().map(this::toListResponse).toList(); }

    private void validateCommon(String inv, String name, String cat, String desc, Boolean allowStudents, EquipmentCondition condition) {
        if (inv.isBlank()) throw new RuntimeException("El numero de inventario es obligatorio");
        if (name.isBlank()) throw new RuntimeException("El nombre del equipo es obligatorio");
        if (cat.isBlank()) throw new RuntimeException("La categoria del equipo es obligatoria");
        if (desc.isBlank()) throw new RuntimeException("La descripcion del equipo es obligatoria");
        if (allowStudents == null) throw new RuntimeException("Debe indicar si el equipo permite estudiantes");
        if (condition == null) throw new RuntimeException("La condicion del equipo es obligatoria");
        if (inv.length() < 3 || inv.length() > 50) throw new RuntimeException("El numero de inventario debe tener entre 3 y 50 caracteres");
        if (name.length() < 3 || name.length() > 100) throw new RuntimeException("El nombre del equipo debe tener entre 3 y 100 caracteres");
        if (cat.length() < 3 || cat.length() > 50) throw new RuntimeException("La categoria del equipo debe tener entre 3 y 50 caracteres");
        if (desc.length() < 10 || desc.length() > 500) throw new RuntimeException("La descripcion del equipo debe tener entre 10 y 500 caracteres");
    }

    private String normalizeText(String v) { return v == null ? "" : v.trim().replaceAll("\\s{2,}", " "); }
    private String normalizeCompact(String v) { return v == null ? "" : v.replaceAll("\\s+", ""); }
    private EquipmentListItemResponse toListResponse(Equipment e) { return EquipmentListItemResponse.builder().id(e.getId()).inventoryNumber(e.getInventoryNumber()).name(e.getName()).category(e.getCategory()).description(e.getDescription()).allowStudents(e.getAllowStudents()).active(e.getActive()).condition(e.getCondition().name()).spaceId(e.getSpace() != null ? e.getSpace().getId() : null).spaceName(e.getSpace() != null ? e.getSpace().getName() : null).build(); }
    private EquipmentDetailResponse toDetailResponse(Equipment e) { return EquipmentDetailResponse.builder().id(e.getId()).inventoryNumber(e.getInventoryNumber()).name(e.getName()).category(e.getCategory()).description(e.getDescription()).allowStudents(e.getAllowStudents()).active(e.getActive()).condition(e.getCondition().name()).spaceId(e.getSpace() != null ? e.getSpace().getId() : null).spaceName(e.getSpace() != null ? e.getSpace().getName() : null).build(); }
}