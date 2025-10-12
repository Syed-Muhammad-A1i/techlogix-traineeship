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
        boolean exists = accountRepository.findByCnic(cnic).isPresent();
        if (!exists) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "CNIC not found");
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
    public Account updateLoginDetails(String accountNumber, String username, String password, String phoneNumber) {
        if (username == null || password == null || phoneNumber == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username, password, and phone number are required");
        }

        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Account not found"));

        User user = account.getUser();
        if (user == null) {
            user = new User();
            user.setAccount(account);
        }

        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhoneNumber(phoneNumber);

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
