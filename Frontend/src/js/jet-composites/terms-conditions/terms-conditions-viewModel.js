define(['ojs/ojcore', 'knockout', 'state/wizardState', 'service/toastService'], function(oj, ko, wizardState, toastService) {
  'use strict';
  
  function tncViewModel() {
    var self = this;

    self.toastService = toastService;

    //  Navigation events
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

    //  Ensure current step syncs with wizardState
    wizardState.currentStep(4);

    //  Go to previous step
    self.previousStep = function() {
      self.backButtonClick();
    };

    //  Go to next step (with API call)
    self.nextStep = async function() {
      const payload = {
        username: wizardState.username(),
        password: wizardState.password()
      };

      const cnic = wizardState.cnic();

      try {
        const response = await fetch(`http://localhost:8081/api/accounts/${cnic}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error("Failed to update login details");

        const result = await response.json();
        console.log(" Login details updated:", result);

        // Show success toast
        toastService.showToastMessage("Account created successfully!", "success");


        // Navigate after toast disappears (small delay)
        setTimeout(() => {
          self.nextButtonClick();
        }, 800);

      } catch (error) {
        console.error("Error saving login details:", error);
        toastService.showToastMessage("Unable to save details. Please try again.", "error");

      }
    };
  }

  return tncViewModel;
});
