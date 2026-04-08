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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/spaces")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SpaceController {

    private final SpaceService spaceService;

    @GetMapping
    public ResponseEntity<Page<SpaceListItemResponse>> getSpaces(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String filter,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(spaceService.getSpaces(page, size, filter, search));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SpaceDetailResponse> getSpaceById(@PathVariable Long id) {
        return ResponseEntity.ok(spaceService.getSpaceById(id));
    }

    @PostMapping
    public ResponseEntity<?> createSpace(@Valid @RequestBody CreateSpaceRequest request) {
        spaceService.createSpace(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSpace(@PathVariable Long id, @Valid @RequestBody UpdateSpaceRequest request) {
        spaceService.updateSpace(id, request);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleSpaceStatus(@PathVariable Long id) {
        spaceService.toggleSpaceStatus(id);
        return ResponseEntity.ok().build();
    }
}