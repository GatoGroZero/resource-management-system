package com.sgr.backend.space.repository;

import com.sgr.backend.space.entity.Space;
import com.sgr.backend.space.entity.SpaceAvailability;
import com.sgr.backend.space.entity.SpaceCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpaceRepository extends JpaRepository<Space, Long> {

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    Page<Space> findByCategory(SpaceCategory category, Pageable pageable);

    Page<Space> findByAvailability(SpaceAvailability availability, Pageable pageable);

    Page<Space> findByCapacityBetween(Integer min, Integer max, Pageable pageable);

    Page<Space> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCase(
            String name,
            String location,
            Pageable pageable
    );

    List<Space> findByActiveTrue();
}