package com.carrotzmarket.api.domain.Address.repository;

import com.carrotzmarket.db.address.Town;
import com.carrotzmarket.db.address.Village;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VillageRepository extends JpaRepository<Village, Long> {
    List<Village> findByTown(Town town);

    Optional<Village> findByVillageNameAndTown(String village, Town town);
    Optional<Village> findByVillageName(String village);
}
