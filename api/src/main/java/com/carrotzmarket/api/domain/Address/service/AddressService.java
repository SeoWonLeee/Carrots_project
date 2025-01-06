package com.carrotzmarket.api.domain.Address.service;

import com.carrotzmarket.api.domain.Address.controller.RegionRequest;
import com.carrotzmarket.api.domain.Address.repository.AddressRepository;
import com.carrotzmarket.api.domain.Address.repository.CityRepository;
import com.carrotzmarket.api.domain.Address.repository.ProvinceRepository;
import com.carrotzmarket.api.domain.Address.repository.TownRepository;
import com.carrotzmarket.api.domain.Address.repository.VillageRepository;
import com.carrotzmarket.db.address.Address;
import com.carrotzmarket.db.address.City;
import com.carrotzmarket.db.address.Province;
import com.carrotzmarket.db.address.Town;
import com.carrotzmarket.db.address.Village;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AddressService {
    private final ProvinceRepository provinceRepository;
    private final CityRepository cityRepository;
    private final TownRepository townRepository;
    private final VillageRepository villageRepository;
    private final AddressRepository addressRepository;


    public Address create(Province province, City city, Town town, Village village) {
        Address address = new Address(province, city, town, village);
        addressRepository.save(address);
        return address;
    }

    public Optional<Province> findProvince(String province) {
        return provinceRepository.findByProvinceName(province);
    }

    public Optional<City> findCity(String city) {
        return cityRepository.findByCityName(city);
    }

    public Optional<Town> findTown(String town) {
        return townRepository.findByTownName(town);
    }

    public Optional<Village> findVillage(String village) {
        return villageRepository.findByVillageName(village);
    }


    public List<String> getRegionsByRequest(RegionRequest request) {
        log.info("로그정보 = {}", request);

        List<String> result = new ArrayList<>();
        // Province 조회
        Province province = provinceRepository.findByProvinceName(request.getProvince())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Province: " + request.getProvince()));

        // City 조회
        City city = cityRepository.findByCityNameAndProvince(request.getCity(), province)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 City: " + request.getCity() + " in Province: " + request.getProvince()));

        // Town 값이 없는 경우 City 하위의 모든 Town 반환
        if (request.getTown() == null || request.getTown().isEmpty() || request.getTown().equals("null")) {
            log.info("Town이 null 또는 비어 있습니다. City의 모든 Town 반환");
            List<Town> byCity = townRepository.findByCity(city);
            for (Town town : byCity) {
                result.add(town.getTownName());
            }
            return result;
        }

        // Town 조회
        Town town = townRepository.findByTownNameAndCity(request.getTown(), city)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 Town: " + request.getTown() + " in City: " + request.getCity()));

        // Village 값이 없는 경우 Town 하위의 모든 Village 반환
        if (request.getVillage() == null || request.getVillage().isEmpty() || request.getVillage().equals("null")) {
            log.info("Village가 null 또는 비어 있습니다. Town의 모든 Village 반환");
            List<Village> byTown = villageRepository.findByTown(town);
            for (Village village : byTown) {
                result.add(village.getVillageName());
            }
            return result;
        }

        // Village 조회
        log.info("findByVillageName 호출");
        Optional<Village> byVillageName = villageRepository.findByVillageName(request.getVillage());

        result.add(byVillageName.get().getVillageName());


        return result;
    }

}
