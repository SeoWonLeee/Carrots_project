package com.carrotzmarket.db.address;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Province {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String provinceName;

    public Province(String provinceName) {
        this.provinceName = provinceName;
    }

    public Province() {

    }

    public String getProvinceName() {
        return provinceName;
    }
}
