package com.example.onboarding.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data                           // Generates getters, setters, equals, hashCode, toString
@NoArgsConstructor              // No-args constructor
@AllArgsConstructor             // All-args constructor
@Builder                        // Enables builder pattern
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, unique = true)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @OneToOne
    @JoinColumn(name = "account_number", referencedColumnName = "account_number")
    @JsonManagedReference
    private Account account;
}
