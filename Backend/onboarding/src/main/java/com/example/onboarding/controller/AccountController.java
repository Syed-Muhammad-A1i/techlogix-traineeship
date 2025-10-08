package com.example.onboarding.controller;

import com.example.onboarding.model.Account;
import com.example.onboarding.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
import java.util.Map;


@CrossOrigin(origins = "http://localhost:8000")
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    // GET /api/accounts/{cnic} → Fetch account info
    @GetMapping("/{cnic}")
    public ResponseEntity<?> getAccountByCnic(@PathVariable String cnic) {
        Optional<Account> account = accountService.getAccountByCnic(cnic);
        if (account.isPresent()) {
            return ResponseEntity.ok(account.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Account not found for CNIC: " + cnic);
        }
    }

    @PostMapping
    public Account createAccount(@RequestBody Account account) {
        return accountService.createAccount(account);
    }

    @PostMapping("/{account_number}")
    public Account updateLogin(@PathVariable String account_number, @RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        String phoneNumber = body.get("phone_number");
        return accountService.updateLoginDetails(account_number, username, password, phoneNumber);
    }
}
