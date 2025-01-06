package com.carrotzmarket.api.domain.Address.controller;

import com.carrotzmarket.api.domain.Address.service.AddressService;
import com.carrotzmarket.db.address.Village;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/regions")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public RegionResponse findRegion(@ModelAttribute RegionRequest request) {
        log.info("지역 정보: {}", request);
        List<String> regionsByRequest = addressService.getRegionsByRequest(request);
        return new RegionResponse("ok", regionsByRequest);
    }
}





