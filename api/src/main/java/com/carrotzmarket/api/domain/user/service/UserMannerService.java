package com.carrotzmarket.api.domain.user.service;

import com.carrotzmarket.api.domain.user.repository.UserRepository;
import com.carrotzmarket.db.user.UserEntity;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserMannerService {

    private final UserRepository userRepository;

    public void updateMannerTemperature(Long sellerId) {
        int completedTransactions = userRepository.countCompletedTransactionsBySellerId(sellerId);

        Optional<UserEntity> sellerOptional = userRepository.findById(sellerId);
        UserEntity seller = sellerOptional.orElseThrow(() -> new IllegalArgumentException("판매자를 찾을 수 없습니다."));

        double newMannerTemperature = 36.5 + completedTransactions;
        userRepository.updateMannerTemperature(sellerId, newMannerTemperature);
    }
}
