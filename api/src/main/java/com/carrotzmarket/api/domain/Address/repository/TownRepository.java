package com.carrotzmarket.api.domain.Address.repository;

import com.carrotzmarket.db.address.City;
import com.carrotzmarket.db.address.Town;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TownRepository extends JpaRepository<Town, Long> {
    Optional<Town> findByTownName(String tineName);
    Optional<Town> findByTownNameAndCity(String townName, City city);
    List<Town> findByCity(City city);
}
