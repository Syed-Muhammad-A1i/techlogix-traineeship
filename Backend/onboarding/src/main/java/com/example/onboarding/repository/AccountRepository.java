package com.example.onboarding.repository;

import com.example.onboarding.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByCnic(String cnic);
    Optional<Account> findByAccountNumber(String accountNumber);
    Optional<Account> findByCnicAndAccountNumber(String cnic, String accountNumber);

}
