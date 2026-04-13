package com.sgr.backend.space.service;

import com.sgr.backend.space.dto.*; import com.sgr.backend.space.entity.*; import com.sgr.backend.space.repository.SpaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SpaceService {

    private final SpaceRepository spaceRepository;

    @Transactional(readOnly = true)
    public Page<SpaceListItemResponse> getSpaces(int page, int size, String filter, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("id").ascending());
        Page<Space> spacesPage;
        if (search != null && !search.isBlank()) { String cs = search.trim().replaceAll("\\s{2,}", " "); spacesPage = spaceRepository.findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(cs, cs, pageable); }
        else if (filter != null && !filter.isBlank()) { switch (filter.toUpperCase()) { case "AULAS" -> spacesPage = spaceRepository.findByCategory(SpaceCategory.AULA, pageable); case "LABORATORIOS" -> spacesPage = spaceRepository.findByCategory(SpaceCategory.LABORATORIO, pageable); case "AUDITORIOS" -> spacesPage = spaceRepository.findByCategory(SpaceCategory.AUDITORIO, pageable); case "SALAS" -> spacesPage = spaceRepository.findByCategory(SpaceCategory.SALA, pageable); case "DISPONIBLE" -> spacesPage = spaceRepository.findByAvailability(SpaceAvailability.DISPONIBLE, pageable); case "OCUPADO" -> spacesPage = spaceRepository.findByAvailability(SpaceAvailability.OCUPADO, pageable); case "MANTENIMIENTO" -> spacesPage = spaceRepository.findByAvailability(SpaceAvailability.MANTENIMIENTO, pageable); case "CAP_SMALL" -> spacesPage = spaceRepository.findByCapacityBetween(1, 30, pageable); case "CAP_MEDIUM" -> spacesPage = spaceRepository.findByCapacityBetween(31, 100, pageable); case "CAP_LARGE" -> spacesPage = spaceRepository.findByCapacityBetween(101, 10000, pageable); default -> spacesPage = spaceRepository.findAll(pageable); } }
        else { spacesPage = spaceRepository.findAll(pageable); }
        return spacesPage.map(this::toListResponse);
    }

    @Transactional(readOnly = true)
    public SpaceDetailResponse getSpaceById(Long id) { return toDetailResponse(spaceRepository.findById(id).orElseThrow(() -> new RuntimeException("Espacio no encontrado"))); }

    @Transactional
    public void createSpace(CreateSpaceRequest request) {
        String name = normalizeText(request.getName()); String location = normalizeText(request.getLocation()); String description = normalizeDescription(request.getDescription());
        validateCommon(name, request.getCategory(), location, request.getCapacity(), description, request.getAllowStudents(), request.getAvailability());
        if (spaceRepository.existsByNameIgnoreCase(name)) throw new RuntimeException("Ya existe un espacio con ese nombre");
        spaceRepository.save(Space.builder().name(name).category(request.getCategory()).location(location).capacity(request.getCapacity()).description(description).allowStudents(request.getAllowStudents()).active(request.getActive() != null ? request.getActive() : true).availability(request.getAvailability()).createdAt(LocalDateTime.now()).build());
    }

    @Transactional
    public void updateSpace(Long id, UpdateSpaceRequest request) {
        Space space = spaceRepository.findById(id).orElseThrow(() -> new RuntimeException("Espacio no encontrado"));
        String name = normalizeText(request.getName()); String location = normalizeText(request.getLocation()); String description = normalizeDescription(request.getDescription());
        validateCommon(name, request.getCategory(), location, request.getCapacity(), description, request.getAllowStudents(), request.getAvailability());
        if (spaceRepository.existsByNameIgnoreCaseAndIdNot(name, id)) throw new RuntimeException("Ya existe un espacio con ese nombre");
        space.setName(name); space.setCategory(request.getCategory()); space.setLocation(location); space.setCapacity(request.getCapacity()); space.setDescription(description); space.setAllowStudents(request.getAllowStudents()); space.setActive(request.getActive() != null ? request.getActive() : space.getActive()); space.setAvailability(request.getAvailability());
        spaceRepository.save(space);
    }

    @Transactional
    public void toggleSpaceStatus(Long id) { Space space = spaceRepository.findById(id).orElseThrow(() -> new RuntimeException("Espacio no encontrado")); space.setActive(!space.getActive()); spaceRepository.save(space); }

    private void validateCommon(String name, SpaceCategory category, String location, Integer capacity, String description, Boolean allowStudents, SpaceAvailability availability) {
        if (name.isBlank()) throw new RuntimeException("El nombre del espacio es obligatorio");
        if (category == null) throw new RuntimeException("La categoria del espacio es obligatoria");
        if (location.isBlank()) throw new RuntimeException("La ubicacion del espacio es obligatoria");
        if (capacity == null) throw new RuntimeException("La capacidad del espacio es obligatoria");
        if (description.isBlank()) throw new RuntimeException("La descripcion del espacio es obligatoria");
        if (allowStudents == null) throw new RuntimeException("Debe indicar si el espacio permite estudiantes");
        if (availability == null) throw new RuntimeException("La disponibilidad del espacio es obligatoria");
        if (name.length() < 3 || name.length() > 100) throw new RuntimeException("El nombre del espacio debe tener entre 3 y 100 caracteres");
        if (location.length() < 3 || location.length() > 150) throw new RuntimeException("La ubicacion debe tener entre 3 y 150 caracteres");
        if (description.length() < 10 || description.length() > 500) throw new RuntimeException("La descripcion del espacio debe tener entre 10 y 500 caracteres");
        if (capacity < 1 || capacity > 10000) throw new RuntimeException("La capacidad debe estar entre 1 y 10000");
    }

    private String normalizeText(String v) { return v == null ? "" : v.trim().replaceAll("\\s{2,}", " "); }
    private String normalizeDescription(String v) { return v == null ? "" : v.trim().replaceAll("\\s{2,}", " "); }
    private SpaceListItemResponse toListResponse(Space s) { return SpaceListItemResponse.builder().id(s.getId()).name(s.getName()).category(s.getCategory().name()).location(s.getLocation()).capacity(s.getCapacity()).description(s.getDescription()).allowStudents(s.getAllowStudents()).active(s.getActive()).availability(s.getAvailability().name()).build(); }
    private SpaceDetailResponse toDetailResponse(Space s) { return SpaceDetailResponse.builder().id(s.getId()).name(s.getName()).category(s.getCategory().name()).location(s.getLocation()).capacity(s.getCapacity()).description(s.getDescription()).allowStudents(s.getAllowStudents()).active(s.getActive()).availability(s.getAvailability().name()).build(); }
}