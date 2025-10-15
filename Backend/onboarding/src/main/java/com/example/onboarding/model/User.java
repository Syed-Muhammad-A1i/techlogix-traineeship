package com.example.onboarding.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data                           // Generates getters, setters, equals, hashCode, toString
@NoArgsConstructor              // No-args constructor
@AllArgsConstructor             // All-args constructor
@Builder                        // Enables builder pattern
public class User {
    @Id
    @Column(name = "cnic")
    private String cnic;  // same CNIC as Account

    @OneToOne
    @MapsId  // tells JPA to use the same PK as Account
    @JoinColumn(name = "cnic")
    @JsonManagedReference
    private Account account;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

}
