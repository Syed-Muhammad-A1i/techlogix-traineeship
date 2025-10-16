package com.example.onboarding.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.Immutable;
import lombok.Data;

@Data
@Entity
@Immutable                       // ensures Hibernate doesn’t try to INSERT/UPDATE
@Table(name = "vw_account_summary")
public class AccountSummaryView {

    @Id
    private String cnic;
    private String username;
    private String name;
    private String accountNumber;
    private String accountType;
}
