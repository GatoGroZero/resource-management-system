package com.sgr.backend.equipment.repository;

import com.sgr.backend.equipment.entity.Equipment;
import com.sgr.backend.equipment.entity.EquipmentCondition;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {

    boolean existsByCodeIgnoreCase(String code);

    boolean existsByCodeIgnoreCaseAndIdNot(String code, Long id);

    Page<Equipment> findByCondition(EquipmentCondition condition, Pageable pageable);

    Page<Equipment> findByCategoryIgnoreCase(String category, Pageable pageable);

    Page<Equipment> findByQuantityBetween(Integer min, Integer max, Pageable pageable);

    Page<Equipment> findByNameContainingIgnoreCaseOrCodeContainingIgnoreCase(
            String name,
            String code,
            Pageable pageable
    );
}