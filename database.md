# 🏦 Online Mobile Banking Database Schema (End User Focused)

This document describes a **fully normalized database schema (3NF)** for an **Online Mobile Banking System** designed for end users.  
The schema is secure, scalable, and structured for real-world banking applications.

---

## 📘 Overview

| Module | Description |
|---------|--------------|
| **USERS** | Stores login and authentication details |
| **USER_PROFILE** | Stores personal and contact information |
| **ACCOUNTS** | Stores bank account details (one or more per user) |
| **ACCOUNT_COMPLIANCE** | Stores regulatory and tax-related info per account |
| **OTP_LOGS** | Stores OTPs for secure operations |

---

## 🧱 1. USERS

Holds basic authentication and login tracking details.

| Field | Type | Constraints | Description |
|--------|------|-------------|--------------|
| user_id | INT | **PK, AUTO_INCREMENT** | Unique user ID |
| username | VARCHAR(50) | **UNIQUE, NOT NULL** | Used for login |
| password_hash | VARCHAR(255) | **NOT NULL** | Encrypted password |
| account_status | ENUM('ACTIVE','INACTIVE') | **DEFAULT 'ACTIVE'** | User account state |
| created_at | DATETIME | **DEFAULT CURRENT_TIMESTAMP** | Date created |
| last_login | DATETIME | | Last login timestamp |

**Purpose:**  
Separates login data from personal and financial info, improving security and compliance.

---

## 🧾 2. USER_PROFILE

Stores personal and contact details for each user.

| Field | Type | Constraints | Description |
|--------|------|-------------|--------------|
| profile_id | INT | **PK, AUTO_INCREMENT** | Unique profile record |
| user_id | INT | **FK → USERS(user_id)** | Linked to user |
| full_name | VARCHAR(100) | **NOT NULL** | Account title or full name |
| cnic | VARCHAR(15) | **UNIQUE, NOT NULL** | National ID |
| cnic_expiration | DATE | | CNIC expiry date |
| date_of_birth | DATE | | Date of birth |
| home_address | VARCHAR(255) | | Residential address |
| contact_number | VARCHAR(20) | **UNIQUE, NOT NULL** | Registered phone number |
| email_address | VARCHAR(100) | UNIQUE | Email address |
| country | VARCHAR(50) | | Country of residence |
| city | VARCHAR(50) | | City of residence |

**Purpose:**  
Keeps personal details independent of login or account data.

---

## 💳 3. ACCOUNTS

Contains multiple account records for a single user.

| Field | Type | Constraints | Description |
|--------|------|-------------|--------------|
| account_id | INT | **PK, AUTO_INCREMENT** | Account record ID |
| user_id | INT | **FK → USERS(user_id)** | Account owner |
| account_number | VARCHAR(20) | **UNIQUE, NOT NULL** | Bank account number |
| account_title | VARCHAR(100) | **NOT NULL** | Usually same as user’s full name |
| account_type | ENUM('SAVINGS','CURRENT','JOINT') | **NOT NULL** | Account type |
| iban | VARCHAR(24) | **UNIQUE, NOT NULL** | International Bank Account Number |
| created_at | DATETIME | **DEFAULT CURRENT_TIMESTAMP** | Account creation date |

**Purpose:**  
Allows each user to maintain multiple accounts with distinct identifiers and types.

---

## 🧮 4. ACCOUNT_COMPLIANCE

Tracks compliance and regulatory details per account.

| Field | Type | Constraints | Description |
|--------|------|-------------|--------------|
| compliance_id | INT | **PK, AUTO_INCREMENT** | Unique record |
| account_id | INT | **FK → ACCOUNTS(account_id)** | Linked to account |
| filer_status | ENUM('FILER','NON-FILER') | **DEFAULT 'NON-FILER'** | Tax status |
| zakat_deduction_status | ENUM('APPLICABLE','EXEMPT') | **DEFAULT 'APPLICABLE'** | Zakat deduction |
| cnic_verified | BOOLEAN | **DEFAULT FALSE** | CNIC verification flag |
| last_verification_date | DATETIME | | Last KYC verification date |

**Purpose:**  
Keeps tax and compliance info separate from core account data.

---

## 🔐 5. OTP_LOGS

Stores One-Time Passwords (OTPs) generated for different user operations.

| Field | Type | Constraints | Description |
|--------|------|-------------|--------------|
| otp_id | INT | **PK, AUTO_INCREMENT** | Unique OTP ID |
| user_id | INT | **FK → USERS(user_id)** | Owner of OTP |
| otp_code | VARCHAR(6) | **NOT NULL** | Generated OTP |
| flow_type | ENUM('EDIT_PROFILE','TRANSACTION','ONBOARDING','FORGOT_PASSWORD','CHANGE_PIN') | **NOT NULL** | Purpose of OTP |
| created_at | DATETIME | **DEFAULT CURRENT_TIMESTAMP** | Generated time |
| expires_at | DATETIME | | Expiration time |
| verified | BOOLEAN | **DEFAULT FALSE** | Whether OTP was used successfully |

**Purpose:**  
Provides centralized management of all security OTP flows.

---

## 🔗 Relationships Summary

| Relationship | Type | Description |
|---------------|------|-------------|
| USERS → USER_PROFILE | 1 : 1 | Each user has one profile |
| USERS → ACCOUNTS | 1 : N | A user can hold multiple accounts |
| ACCOUNTS → ACCOUNT_COMPLIANCE | 1 : 1 | Each account has one compliance record |
| USERS → OTP_LOGS | 1 : N | A user can generate multiple OTPs |

---