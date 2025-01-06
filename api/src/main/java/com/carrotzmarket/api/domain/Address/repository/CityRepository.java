package com.carrotzmarket.api.domain.Address.repository;

import com.carrotzmarket.db.address.City;
import com.carrotzmarket.db.address.Province;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CityRepository extends JpaRepository<City, Long> {
    Optional<City> findByCityNameAndProvince(String cityName, Province province);
    Optional<City> findByCityName(String city);
}
