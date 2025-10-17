define(['ojs/ojcore', 'knockout', 'state/wizardState'], function (oj, ko, wizardState) {
  'use strict';

  function UsernameStepViewModel() {
    var self = this;

    // -------------------------
    // Navigation Handlers
    // -------------------------
    self.nextButtonClick = function () {
      document.dispatchEvent(new CustomEvent('navigation', {
        detail: { action: 'next', from: 3 },
        bubbles: true,
      }));
    };

    self.backButtonClick = function () {
      document.dispatchEvent(new CustomEvent('navigation', {
        detail: { action: 'previous', from: 3 },
        bubbles: true,
      }));
    };

    wizardState.currentStep(4);

    // -------------------------
    // Observables
    // -------------------------
    self.username = wizardState.username;
    self.isAvailable = ko.observable(false);
    self.isChecking = ko.observable(false);
    self.errorMessage = ko.observable('');
    self.successMessage = ko.observable('');
    self.backendDone = ko.observable(false);

    // -------------------------
// Debounced Backend Validation
// -------------------------
let debounceTimer = null;

// Function to perform the check
function checkUsername(newUsername) {
  self.backendDone(false);
  self.isAvailable(false);
  self.errorMessage('');
  self.successMessage('');

  if (!newUsername || newUsername.trim().length === 0) return;

  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(function () {
    self.isChecking(true);
    fetch(`http://localhost:8081/api/users/check-username?username=${encodeURIComponent(newUsername)}`)
      .then(res => res.json())
      .then(data => {
        self.isChecking(false);
        self.backendDone(true);

        if (data.statusCode === 200) {
          self.successMessage(data.message);
          self.isAvailable(true);
          self.errorMessage('');
        } else {
          self.errorMessage(data.message || 'Invalid username');
          self.isAvailable(false);
          self.successMessage('');
        }
      })
      .catch(err => {
        self.isChecking(false);
        self.backendDone(true);
        self.errorMessage('Error verifying username');
        console.error('Username check error:', err);
      });
  }, 600); // 600ms debounce
}

// Subscribe for user typing
self.username.subscribe(checkUsername);

// -------------------------
// Trigger check immediately on page load
// -------------------------
checkUsername(self.username());
    // -------------------------
    // UI Computeds
    // -------------------------
    self.validationState = ko.computed(function () {
      if (!self.backendDone()) return 'default';
      if (self.errorMessage()) return 'invalid';
      if (self.successMessage()) return 'valid';
      return 'default';
    });

    self.showStatusIcon = ko.computed(function () {
      return self.backendDone() && self.isAvailable();
    });

    // -------------------------
    // Navigation Buttons
    // -------------------------
    self.previousStep = function () {
      wizardState.username(wizardState.phoneNumber());
      self.backButtonClick();
    };

    self.nextStep = function () {
      if (!self.isAvailable()) {
        oj.Logger.error('Please choose a valid and available username before proceeding.');
        self.errorMessage('Please choose a valid and available username.');
        return;
      }

      self.nextButtonClick();
      oj.Logger.info('Proceeding with Username: ' + self.username());
    };

  }

  return UsernameStepViewModel;
});
