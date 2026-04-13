package com.sgr.backend.space.controller;

import com.sgr.backend.space.dto.CreateSpaceRequest;
import com.sgr.backend.space.dto.SpaceDetailResponse;
import com.sgr.backend.space.dto.SpaceListItemResponse;
import com.sgr.backend.space.dto.UpdateSpaceRequest;
import com.sgr.backend.space.service.SpaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/spaces")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SpaceController {

    private final SpaceService spaceService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<Page<SpaceListItemResponse>> getSpaces(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(spaceService.getSpaces(page, size, filter, search));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<SpaceDetailResponse> getSpaceById(@PathVariable Long id) {
        return ResponseEntity.ok(spaceService.getSpaceById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createSpace(@Valid @RequestBody CreateSpaceRequest request) {
        spaceService.createSpace(request);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSpace(@PathVariable Long id, @Valid @RequestBody UpdateSpaceRequest request) {
        spaceService.updateSpace(id, request);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleSpaceStatus(@PathVariable Long id) {
        spaceService.toggleSpaceStatus(id);
        return ResponseEntity.ok().build();
    }
}