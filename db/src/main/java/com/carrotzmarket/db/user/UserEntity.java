package com.carrotzmarket.db.user;

import static java.time.LocalDateTime.now;

import com.carrotzmarket.db.chat.ChatRoomEntity;
import com.carrotzmarket.db.chat.RoomUserEntity;
import com.carrotzmarket.db.region.RegionEntity;
import jakarta.persistence.*;
import javax.swing.plaf.synth.Region;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Getter
@Setter
public class UserEntity {

    public static final int MAX_FAILED_ATTEMPTS = 5;
    public static final int LOCK_DURATION_MINUTES = 5;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, name = "login_id", nullable = false, unique = true)
    private String loginId;

    @Column(length = 100, nullable = false)
    private String password;

    @Column(length = 100, nullable = false, unique = true)
    private String email;

    @Column(length = 100)
    private String phone;

    private LocalDate birthday;

    @Column(name = "profile_image_url", length = 255, nullable = false)
    private String profileImageUrl;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoomUserEntity> roomUser;

    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<UserRegionEntity> regions = new ArrayList<>();

    @Column(name = "failed_login_attempts")
    private Integer failedLoginAttempts;

    @Column(name = "last_failed_login_attempt")
    private LocalDateTime lastFailedLoginAttempt;

    @Column(name = "is_login_locked", nullable = false)
    private boolean isLoginLocked = false;


    @Column(name = "manner_temperature", nullable = false)
    private double mannerTemperature = 36.5;

    @PrePersist
    public void prePersist() {
        this.createdAt = now();
        if (this.profileImageUrl == null || this.profileImageUrl.isEmpty()) {
            this.profileImageUrl = "/uploads/profile-images/default-profile.jpg";
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.lastLoginAt = now();
    }

    public void updateUser(String password, String email, String phone, RegionEntity region, String profileImageUrl) {
        if (!password.isEmpty()) {
            this.password = password;
        }

        if (!email.isEmpty()) {
            this.email = email;
        }

        if (!phone.isEmpty()) {
            this.phone = phone;
        }

        if (region != null) {
            updateRegions(region);
        }

        if (!profileImageUrl.isEmpty()) {
            this.profileImageUrl = profileImageUrl;
        }

    }

    public void loginSuccess() {
        this.failedLoginAttempts = 0;
        this.lastFailedLoginAttempt = null;
        this.isLoginLocked = false;
        this.lastLoginAt = now();
    }

    public void loginFail() {
        if (this.failedLoginAttempts == null) {
            this.failedLoginAttempts = 0;
        }

        this.failedLoginAttempts += 1;
        this.lastFailedLoginAttempt = now();

        if (this.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
            this.isLoginLocked = true;
            this.lastFailedLoginAttempt = lastFailedLoginAttempt.plusMinutes(LOCK_DURATION_MINUTES);
        }
    }

    public boolean isLoginLock() {
        return isLoginLocked && lastFailedLoginAttempt.isAfter(now());
    }

    public String getUserRegion() {
        return regions.stream()
                .findFirst()
                .map(UserRegionEntity::getRegionName)
                .orElse("X");
    }

    public void updateRegions(RegionEntity region) {
        this.regions.clear();
        List<UserRegionEntity> regions = new ArrayList<>();
        regions.add(UserRegionEntity.create(this, region));
        this.regions.addAll(regions);
    }

    public void addRegion(RegionEntity region) {
        UserRegionEntity userRegionEntity = UserRegionEntity.create(this, region);
        this.regions.add(userRegionEntity);
    }


}
