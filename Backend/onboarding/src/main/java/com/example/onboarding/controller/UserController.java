package com.example.onboarding.controller;

import com.example.onboarding.service.UserService;
import com.example.onboarding.DTO.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/check-username")
    public ResponseEntity<ApiResponse<Void>> checkUsername(@RequestParam String username) {
        // 🔍 Step 1: Validate length before querying DB
        if (username == null || username.trim().isEmpty()) {
            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .message("Username cannot be empty")
                    .data(null)
                    .build();
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        if (username.length() < 8 || username.length() > 16) {
            ApiResponse<Void> response = ApiResponse.<Void>builder()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .message("Username must be between 8 and 16 characters long")
                    .data(null)
                    .build();
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

        // 🔍 Step 2: Check availability
        boolean available = userService.isUsernameAvailable(username);
        String message = available ? "Username is available" : "Username is already taken";

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .statusCode(available ? HttpStatus.OK.value() : HttpStatus.CONFLICT.value())
                .message(message)
                .data(null)
                .build();

        return new ResponseEntity<>(response, available ? HttpStatus.OK : HttpStatus.CONFLICT);
    }

}
