package com.carrotzmarket.db.user;

import com.carrotzmarket.db.region.RegionEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;


@Entity
@Table(name = "user_region")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Setter
public class UserRegionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "region_id", nullable = false)
    private RegionEntity region;

    public static UserRegionEntity create(UserEntity user, RegionEntity region) {
        UserRegionEntity userRegionEntity = new UserRegionEntity();
        userRegionEntity.setUser(user);
        userRegionEntity.setRegion(region);
        return userRegionEntity;
    }

    public String getRegionName() {
        return region.getName();
    }
}
