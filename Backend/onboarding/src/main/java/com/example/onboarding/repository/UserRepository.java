package com.example.onboarding.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.onboarding.model.User;

public interface UserRepository extends JpaRepository<User, Long> {}
