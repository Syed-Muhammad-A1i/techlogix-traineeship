define(['ojs/ojcore', 'knockout', 'state/wizardState'], function (oj, ko, wizardState, $) {
  'use strict';

  function AccountDetailsViewModel() {
    var self = this;

    // -------------------------
    // Navigation handlers
    // -------------------------
    self.nextButtonClick = function () {
      document.dispatchEvent(new CustomEvent('navigation', {
        detail: { action: 'next', from: 2 },
        bubbles: true
      }));
    };

    self.backButtonClick = function () {
      document.dispatchEvent(new CustomEvent('navigation', {
        detail: { action: 'previous', from: 2 },
        bubbles: true
      }));
    };

    // -------------------------
    // Step tracking
    // -------------------------
    // self.steps = ko.observableArray([
    //   { number: 1, title: 'Account Type' },
    //   { number: 2, title: 'Account Details' },
    //   { number: 3, title: 'Verification' },
    //   { number: 4, title: 'Login Details' }
    // ]);

    // self.currentStep = ko.observable(2);
    wizardState.currentStep(2); // Ensure wizardState is synced

    // -------------------------
    // Shared State (wizardState)
    // -------------------------
    self.accountNumber = wizardState.accountNumber;
    self.iban = wizardState.iban;
    self.selectedOption = wizardState.selectedOption;
    self.cnic = wizardState.cnic; // Default CNIC for testing

    // For storing verified account details
    wizardState.accountTitle = wizardState.accountTitle || ko.observable("");
    wizardState.phoneNumber = wizardState.phoneNumber || ko.observable("");

    // -------------------------
    // Input validation + UI state
    // -------------------------
    self.accEdited = ko.observable(false);
    self.isMatched = ko.observable(false);
    self.cnicErrorMessage = ko.observable("");
    self.isLoading = ko.observable(false);
    self.backendcall = ko.observable(false);

    // Select option handler
    self.selectOption = function (option) {
      self.selectedOption(option);
    };

    // Account number formatting
    self.formattedAccountNumber = ko.computed({
      read: function () {
        let value = self.accountNumber().replace(/\D/g, "");
        if (value.length > 14) value = value.substring(0, 14);
        return value;
      },
      write: function (val) {
        self.accountNumber(val.replace(/\D/g, ""));
      }
    });

    // Validation
    self.isAccNoValid = ko.computed(function () {
      return /^\d{14}$/.test(self.accountNumber());
    });

    // Subscribe for local validation only
    self.accountNumber.subscribe(function (newValue) {
        self.backendcall(false);
        self.accEdited(true);
        self.cnicErrorMessage("");

        if (!self.isAccNoValid()) {
            self.isMatched(false);
        }
    });

    // Dynamic input class based on validation and match
    self.accInputClass = ko.computed(function () {
        
      if (!self.accEdited()) return 'default';
      if (!self.isAccNoValid()) return 'invalid';
      if (!self.backendcall()) return 'valid';
      return self.isMatched() ? 'valid' : 'invalid';
    });

    // -------------------------
    // Backend Verification (only when Next clicked)
    // -------------------------
    self.verifyAccount = function () {
      self.isLoading(true);
      self.cnicErrorMessage("");

      return fetch(`http://localhost:8081/api/accounts/verify?cnic=${self.cnic()}&accountNumber=${self.accountNumber()}`)
        .then(res => res.json())
        .then(data => {
          self.isLoading(false);
          if (data.statusCode === 200 && data.data) {
            // ✅ Verification success
            self.isMatched(true);
            wizardState.accountTitle(data.data.accountTitle);
            wizardState.phoneNumber(data.data.phoneNumber);
            wizardState.username(data.data.phoneNumber);

            console.log("Verified Account Title:", data.data.accountTitle);
            console.log("Verified Phone Number:", data.data.phoneNumber);
            return true;
          } else {
            //  Verification failed
            self.isMatched(false);
            self.cnicErrorMessage(" Account Number Not Matched");
            return false;
          }
        })
        .catch(err => {
          self.isLoading(false);
          self.isMatched(false);
          self.cnicErrorMessage("⚠️ Error verifying account");
          console.error("Verification error:", err);
          return false;
        })
        .finally(() => {
          self.backendcall(true);
        });
    };

    // -------------------------
    // Navigation buttons
    // -------------------------
    self.previousStep = function () {
      wizardState.accountNumber('');
      self.backButtonClick();
    };

    self.nextStep = async function () {
      self.accEdited(true);

      if (!self.isAccNoValid()) {
        self.cnicErrorMessage(" Please enter a valid 14-digit Account Number");
        return;
      }

      const verified = await self.verifyAccount();
      if (verified) {
        self.nextButtonClick();
        oj.Logger.info("Proceeding with Account Number: " + self.formattedAccountNumber());
      }
    };
  }

  return AccountDetailsViewModel;
});
