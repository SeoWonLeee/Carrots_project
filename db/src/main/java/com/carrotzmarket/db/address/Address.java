package com.carrotzmarket.db.address;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "province_id", nullable = false)
    private Province province;

    @ManyToOne(fetch = FetchType.LAZY, optional = true) // 수정: optional = true
    @JoinColumn(name = "city_id", nullable = true) // nullable = true
    private City city;

    @ManyToOne(fetch = FetchType.LAZY, optional = true) // 수정: optional = true
    @JoinColumn(name = "town_id", nullable = true) // nullable = true
    private Town town;

    @ManyToOne(fetch = FetchType.LAZY, optional = true) // 수정: optional = true
    @JoinColumn(name = "village_id", nullable = true) // nullable = true
    private Village village;

    public Address(Province province, City city, Town town, Village village) {
        this.province = province;
        this.city = city;
        this.town = town;
        this.village = village;
    }

    public String getAddress() {

        if (village != null) {
            return this.village.getVillageName();
        } else if (town != null) {
            return this.town.getTownName();
        } else if (city != null) {
            return this.town.getTownName();
        } else {
            return this.province.getProvinceName();
        }
    }
}
