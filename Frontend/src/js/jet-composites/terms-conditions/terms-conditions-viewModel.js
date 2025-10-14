define(['ojs/ojcore', 'knockout', 'state/wizardState'], function(oj, ko, wizardState) {
  'use strict';
  
  function tncViewModel() {
    var self = this;
    console.log('hello');

    // 🔸 Toast observable
    self.showToast = ko.observable(false);

    // 🔸 Function to show and auto-hide toast
    self.createAccount = function() {
      self.showToast(true);
      setTimeout(() => self.showToast(false), 6000);
    };

    // 🔸 Navigation events
    self.nextButtonClick = function() {
      document.dispatchEvent(new CustomEvent('navigation', {
        detail: { action: 'next', from: 5 },
        bubbles: true
      }));
    };

    self.backButtonClick = function() {
      document.dispatchEvent(new CustomEvent('navigation', {
        detail: { action: 'previous', from: 5 },
        bubbles: true
      }));
    };

    // 🔸 Ensure current step syncs with wizardState
    wizardState.currentStep(4);

    // 🔸 Go to previous step
    self.previousStep = function() {
      self.backButtonClick();
    };

    // 🔸 Go to next step (with API call)
    self.nextStep = async function() {
      const payload = {
        username: wizardState.username(),
        password: wizardState.password(),
        phone_number: wizardState.phoneNumber()
      };

      const accountNumber = wizardState.accountNumber();

      try {
        const response = await fetch(`http://localhost:8081/api/accounts/${accountNumber}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to update login details");

        const result = await response.json();
        console.log("✅ Login details updated:", result);

        // 🟢 Show success toast
        self.createAccount();

        // 🟢 Navigate after toast disappears (small delay)
        setTimeout(() => {
          self.nextButtonClick();
        }, 800);

      } catch (error) {
        console.error("Error saving login details:", error);
        alert("⚠️ Unable to save details. Please try again.");
      }
    };
  }

  return tncViewModel;
});
