package com.carrotzmarket.api.domain.Address.repository;

import com.carrotzmarket.db.address.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
}
