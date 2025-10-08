package com.example.onboarding.service;

import com.example.onboarding.model.Account;
import com.example.onboarding.model.User;
import com.example.onboarding.repository.AccountRepository;
import com.example.onboarding.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public Optional<Account> getAccountByCnic(String cnic) {
        return accountRepository.findByCnic(cnic);
    }


    public Account createAccount(Account account) {
        return accountRepository.save(account);
    }

    public Account updateLoginDetails(String account_number, String username, String password, String Phone_number) {
        Account account = accountRepository.findByAccountNumber(account_number)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        User user = account.getUser();
        if (user == null) {
            user = new User();
            user.setAccount(account);
        }
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhone_number(Phone_number);

        userRepository.save(user);
        return account;
    }


    public boolean verifyAccountForCnic(String cnic, String accountNumber) {
        // Find account by CNIC
        Optional<Account> accountOpt = accountRepository.findByCnic(cnic);

        if (accountOpt.isEmpty()) {
            return false; // CNIC not found
        }

        Account account = accountOpt.get();

        // Check if account number matches
        return account.getAccountNumber().equals(accountNumber);
    }

}
