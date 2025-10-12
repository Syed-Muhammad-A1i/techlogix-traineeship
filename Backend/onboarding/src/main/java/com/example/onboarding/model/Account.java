package com.example.onboarding.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "account")
@Data                           // Generates getters, setters, equals, hashCode, toString
@NoArgsConstructor              // Generates no-args constructor
@AllArgsConstructor             // Generates all-args constructor
@Builder                        // Enables builder pattern (optional but handy)
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "cnic", nullable = false, unique = true)
    private String cnic;

    @Column(name = "account_number", nullable = false, unique = true)
    private String accountNumber;

    @Column(name = "account_type", nullable = false)
    private String accountType;

    @Column(name = "account_title", nullable = false)
    private String accountTitle;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    @JsonBackReference
    private User user;
}
