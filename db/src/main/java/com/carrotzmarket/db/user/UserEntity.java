package com.carrotzmarket.db.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class UserEntity {

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

    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<UserRegionEntity> userRegions = new ArrayList<>();

    @Column(length = 100)
    private String region;

    @Column(name = "failed_login_attempts", nullable = false)
    private int failedLoginAttempts = 0;

    @Column(name = "last_failed_login_attempt")
    private LocalDateTime lastFailedLoginAttempt;

    @Column(name = "is_login_locked", nullable = false)
    private boolean isLoginLocked = false;

    public static final int MAX_FAILED_ATTEMPTS = 5;
    public static final int LOCK_DURATION_MINUTES = 5;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.profileImageUrl == null || this.profileImageUrl.isEmpty()) {
            this.profileImageUrl = "/uploads/profile-images/default-profile.jpg";
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.lastLoginAt = LocalDateTime.now();
    }

    // Increment failed login attempts
    public void incrementFailedAttempts() {
        this.failedLoginAttempts++;
    }

    // Reset failed login attempts
    public void resetFailedAttempts() {
        this.failedLoginAttempts = 0;
        this.lastFailedLoginAttempt = null;
        this.isLoginLocked = false;
    }

    // Lock the account
    public void lockAccount() {
        this.isLoginLocked = true;
        this.lastFailedLoginAttempt = LocalDateTime.now();
    }

    // Check if the account is still locked
    public boolean isAccountLocked() {
        return this.isLoginLocked && this.lastFailedLoginAttempt != null
                && this.lastFailedLoginAttempt.isAfter(LocalDateTime.now().minusMinutes(LOCK_DURATION_MINUTES));
    }
}
