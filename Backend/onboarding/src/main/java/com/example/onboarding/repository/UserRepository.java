package com.example.onboarding.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.onboarding.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByUsernameIgnoreCase(String username);
    Optional<User> findByCnic(String cnic);
}
