package com.example.onboarding.repository;

import com.example.onboarding.model.AccountSummaryView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountSummaryRepository extends JpaRepository<AccountSummaryView, String> {
    Optional<AccountSummaryView> findByCnic(String cnic);
}
