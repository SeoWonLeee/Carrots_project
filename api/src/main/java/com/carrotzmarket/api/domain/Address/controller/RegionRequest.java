package com.carrotzmarket.api.domain.Address.controller;

import lombok.Data;

@Data
public class RegionRequest {
    private String province;
    private String city;
    private String town;
    private String village;
}
