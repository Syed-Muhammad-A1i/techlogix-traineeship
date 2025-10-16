package com.example.onboarding.controller;

import com.example.onboarding.DTO.ApiResponse;
import com.example.onboarding.model.AccountSummaryView;
import com.example.onboarding.service.AccountSummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountSummaryController {

    @Autowired
    private AccountSummaryService summaryService;

    // ✅ Get single record by CNIC
    @GetMapping("/summary/{cnic}")
    public ResponseEntity<ApiResponse<AccountSummaryView>> getAccountSummary(@PathVariable String cnic) {
        ApiResponse<AccountSummaryView> response = summaryService.getSummaryByCnic(cnic);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    // ✅ Get all records
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<List<AccountSummaryView>>> getAllAccountSummaries() {
        ApiResponse<List<AccountSummaryView>> response = summaryService.getAllSummaries();
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }
}
