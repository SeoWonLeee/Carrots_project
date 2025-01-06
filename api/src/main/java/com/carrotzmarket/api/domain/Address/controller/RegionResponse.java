package com.carrotzmarket.api.domain.Address.controller;

import java.util.List;
import lombok.Data;

@Data
public class RegionResponse {
    private String status;
    private List<String> villages;

    public RegionResponse(String status, List<String> villages) {
        this.status = status;
        this.villages = villages;
    }

    public String getStatus() {
        return status;
    }

    public List<String> getVillages() {
        return villages;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setVillages(List<String> villages) {
        this.villages = villages;
    }
}
