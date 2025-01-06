package com.carrotzmarket.api.domain.Address.repository;

import com.carrotzmarket.db.address.Province;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProvinceRepository extends JpaRepository<Province, Long> {
    Optional<Province> findByProvinceName(String provinceName);
}
