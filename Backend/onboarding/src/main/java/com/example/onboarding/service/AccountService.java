package com.example.onboarding.service;

import com.example.onboarding.model.Account;
import com.example.onboarding.model.User;
import com.example.onboarding.repository.AccountRepository;
import com.example.onboarding.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    public AccountService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    // Get account by CNIC
    public void checkCnicExists(String cnic) {
        // Step 1️⃣: Check if account exists
        Account account = accountRepository.findByCnic(cnic)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found for this CNIC"));

        // Step 2️⃣: Check if account is active
        if (!account.isAccountStatus())
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account is inactive");


        boolean userExists = userRepository.findByCnic(cnic).isPresent();
        if (userExists) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already exists for this CNIC");
        }
        // No return needed, just passes if CNIC exists
    }

    // Create new account
    public Account createAccount(Account account) {
        try {
            return accountRepository.save(account);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to create account");
        }
    }

    // Update login details
    public Account updateLoginDetails(String cnic, String username, String password) {
        if (username == null || password == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username, password, and phone number are required");
        }

        Account account = accountRepository.findByCnic(cnic)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found"));

        User user = account.getUser();
        if (user == null) {
            user = new User();
            user.setAccount(account);
        }

        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setCreatedAt(LocalDateTime.now());


        userRepository.save(user);
        return account;
    }

    // Verify CNIC and Account Number
    public Account verifyAccountForCnic(String cnic, String accountNumber) {
        return accountRepository.findByCnicAndAccountNumber(cnic, accountNumber)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No account found for CNIC: " + cnic + " and Account Number: " + accountNumber
                ));
    }
}
