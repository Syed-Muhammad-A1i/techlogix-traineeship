package com.example.onboarding.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.processing.Pattern;

import java.time.LocalDateTime;

@Entity
@Table(name = "account")
@Data                           // Generates getters, setters, equals, hashCode, toString
@NoArgsConstructor              // Generates no-args constructor
@AllArgsConstructor             // Generates all-args constructor
@Builder                        // Enables builder pattern (optional but handy)
public class Account {

    @Id
    @Column(name = "cnic", nullable = false, unique = true, length = 13)
    private String cnic;

    @Column(name = "account_number", nullable = false, unique = true, length = 14)
    private String accountNumber;

    @Column(name = "account_type", nullable = false)
    private String accountType;

    @Column(name = "account_title", nullable = false)
    private String accountTitle;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "iban", nullable = false, unique = true)
    private String iban;

    @Column(name = "account_Status", nullable = false)
    private boolean accountStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    @JsonBackReference
    private User user;
}
