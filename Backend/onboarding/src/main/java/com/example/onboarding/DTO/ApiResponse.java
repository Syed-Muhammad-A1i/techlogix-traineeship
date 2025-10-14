package com.example.onboarding.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    private int statusCode;   // e.g. 200, 404
    private String message;   // human-readable message
    private T data;           // response payload
    //success boolean
}
