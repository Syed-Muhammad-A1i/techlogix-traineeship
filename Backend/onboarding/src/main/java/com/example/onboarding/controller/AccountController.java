package com.example.onboarding.controller;

import com.example.onboarding.DTO.ApiResponse;
import com.example.onboarding.model.Account;
import com.example.onboarding.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:8000")
@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    // GET: Fetch account by CNIC
    @GetMapping("/{cnic}")
    public ResponseEntity<ApiResponse<Void>> checkCnicExists(@PathVariable String cnic) {
        accountService.checkCnicExists(cnic);  // throws exception if CNIC not found

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .statusCode(HttpStatus.OK.value())
                .message("CNIC exists")
                .data(null)
                .build();

        return ResponseEntity.ok(response);
    }



    // POST: Create new account
    @PostMapping
    public ResponseEntity<ApiResponse<Account>> createAccount(@RequestBody Account account) {
        Account created = accountService.createAccount(account);
        ApiResponse<Account> response = ApiResponse.<Account>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Account created successfully")
                .data(created)
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // POST: Update login details
    @PostMapping("/{account_number}")
    public ResponseEntity<ApiResponse<Account>> updateLogin(
            @PathVariable String account_number,
            @RequestBody Map<String, String> body) {

        Account updated = accountService.updateLoginDetails(
                account_number,
                body.get("username"),
                body.get("password"),
                body.get("phone_number")
        );

        ApiResponse<Account> response = ApiResponse.<Account>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Login details updated successfully")
                .data(updated)
                .build();

        return ResponseEntity.ok(response);
    }

    // Get: Verify CNIC & Account Number
    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<?>> verifyAccount(@RequestBody Map<String, String> body) {

        String cnic = body.get("cnic");
        String accountNumber = body.get("accountNumber");

        Account account = accountService.verifyAccountForCnic(cnic, accountNumber);

        ApiResponse<Account> response = new ApiResponse<>(
                HttpStatus.OK.value(),
                "Account found successfully",
                account
        );

        return ResponseEntity.ok(response);
    }

}
