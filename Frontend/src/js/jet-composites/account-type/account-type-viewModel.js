define(['knockout', 'ojs/ojrouter', 'state/wizardState'], function (ko, Router, wizardState) {
  function Page1ViewModel() {
    var self = this;

    // -------------------------
    // Navigation handlers
    // -------------------------
    self.nextButtonClick = function () {
      document.dispatchEvent(new CustomEvent('navigation', {
        detail: { action: 'next', from: 'page1' },
        bubbles: true
      }));
    };

    self.backButtonClick = function () {
      document.dispatchEvent(new CustomEvent('navigation', {
        detail: { action: 'previous', from: 'page1' },
        bubbles: true
      }));
    };

    // -------------------------
    // Step tracking
    // -------------------------
    self.steps = ko.observableArray([
      { number: 1, title: 'Account Type' },
      { number: 2, title: 'Account Details' },
      { number: 3, title: 'Verification' },
      { number: 4, title: 'Login Details' }
    ]);
    self.currentStep = ko.observable(1);

    // -------------------------
    // Shared State (wizardState)
    // -------------------------
    self.cnicNumberRaw = wizardState.cnic;
    self.selectedAccountType = wizardState.accountType;

    // -------------------------
    // Account types
    // -------------------------
    self.accountTypes = ko.observableArray([
      { id: 1, name: "Individual", defaultImage: "css/images/Individual-Icon-Unfilled.svg", selectedImage: "css/images/Individual-Icon-Filled.svg" },
      { id: 2, name: "Foreign National", defaultImage: "css/images/Foreign-National-Icon-Unfilled.svg", selectedImage: "css/images/Foreign-National-Icon-Filled.svg" }
    ]);

    self.selectAccountType = function (item) {
      self.selectedAccountType(item.name);
      wizardState.accountType(item.name);
    };

    // -------------------------
    // CNIC formatting & validation
    // -------------------------
    self.cnicEdited = ko.observable(false);
    self.isMatched = ko.observable(false);
    self.cnicErrorMessage = ko.observable("");
    self.BackendcallDone = ko.observable(false);

    self.formattedCnicNumber = ko.computed({
      read: function () {
        let value = self.cnicNumberRaw().replace(/\D/g, "");
        if (value.length > 13) value = value.substring(0, 13);

        let part1 = value.substring(0, 5);
        let part2 = value.substring(5, 12);
        let part3 = value.substring(12, 13);

        let formatted = part1;
        if (part2) formatted += "-" + part2;
        if (part3) formatted += "-" + part3;
        return formatted;
      },
      write: function (val) {
        self.cnicNumberRaw(val.replace(/\D/g, ""));
      }
    });

    self.isCnicValid = ko.computed(function () {
      return /^\d{13}$/.test(self.cnicNumberRaw());
    });

    // -------------------------
    // Subscribe → Local validation only
    // -------------------------
    self.cnicNumberRaw.subscribe(function (newValue) {
      self.cnicEdited(true);
      self.BackendcallDone(false);
      if (!self.isCnicValid()) {
        self.isMatched(false);
        self.cnicErrorMessage("❌ CNIC must be 13 digits");
      } else {
        self.cnicErrorMessage("");
      }
    });

    // -------------------------
    // CNIC input CSS
    // -------------------------
    self.cnicInputClass = ko.computed(function () {
      
      if (!self.cnicEdited()) return 'default';
      if (!self.isCnicValid()) return 'invalid';
      if (!self.BackendcallDone()) return 'valid';
      return self.isMatched() ? 'valid' : 'invalid';
    });

    // -------------------------
    // Backend CNIC verification (called on Next)
    // -------------------------
    self.checkCnicInBackend = async function () {
      const cnic = self.cnicNumberRaw();
      try {
        const response = await fetch(`http://localhost:8081/api/accounts/${cnic}`);
        const result = await response.json();

        if (!response.ok) {
          self.isMatched(false);
          self.cnicErrorMessage("❌ CNIC not found in records");
          return false;
        }

        self.isMatched(true);
        self.cnicErrorMessage("");
        self.BackendcallDone(true);
        return true;

      } catch (error) {
        console.error("Error verifying CNIC:", error);
        self.cnicErrorMessage("⚠️ Server issue. Please try again.");
        self.isMatched(false);
        // self.BackendcallDone(true);
        return false;
      }
    };

    // -------------------------
    // Navigation Actions
    // -------------------------
    self.previousStep = function () {
      self.backButtonClick();
    };

    self.nextStep = async function () {
      self.cnicEdited(true);

      if (!self.selectedAccountType()) {
        alert("⚠️ Please select an account type first.");
        return;
      }

      if (!self.isCnicValid()) {
        alert("⚠️ Please enter a valid 13-digit CNIC.");
        return;
      }

      const verified = await self.checkCnicInBackend();
      self.BackendcallDone(true);
      if (verified) {
        self.nextButtonClick();
      }
    };
  }

  return Page1ViewModel;
});
