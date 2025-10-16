package com.example.onboarding.service;

import com.example.onboarding.DTO.ApiResponse;
import com.example.onboarding.model.AccountSummaryView;
import com.example.onboarding.repository.AccountSummaryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AccountSummaryService {

    @Autowired
    private AccountSummaryRepository summaryRepository;

    public ApiResponse<AccountSummaryView> getSummaryByCnic(String cnic) {
        return summaryRepository.findByCnic(cnic)
                .map(summary -> ApiResponse.<AccountSummaryView>builder()
                        .statusCode(HttpStatus.OK.value())
                        .message("Account summary fetched successfully")
                        .data(summary)
                        .build())
                .orElseGet(() -> ApiResponse.<AccountSummaryView>builder()
                        .statusCode(HttpStatus.NOT_FOUND.value())
                        .message("No account summary found for CNIC: " + cnic)
                        .data(null)
                        .build());
    }

    public ApiResponse<List<AccountSummaryView>> getAllSummaries() {
        List<AccountSummaryView> summaries = summaryRepository.findAll();
        return ApiResponse.<List<AccountSummaryView>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("All account summaries fetched successfully")
                .data(summaries)
                .build();
    }
}
