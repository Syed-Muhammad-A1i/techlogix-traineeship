// File: src/js/services/toastService.js
define(['knockout'], function (ko) {
  'use strict';

  function ToastService() {
    const self = this;

    // Observables for toast state
    self.toastMessage = ko.observable('');
    self.showToast = ko.observable(false);
    self.toastType = ko.observable('info'); // info | success | error | warning

    /**
     * Display a toast message for a few seconds
     * @param {string} message - The message text
     * @param {string} type - Toast type: 'info', 'success', 'error', 'warning'
     */
    self.showToastMessage = function (message, type = 'info') {
      self.toastMessage(message);
      self.toastType(type);
      self.showToast(true);

      // Automatically hide after 3 seconds
      setTimeout(() => self.showToast(false), 3000);
    };

    return self;
  }

  // Return a single shared instance
  return new ToastService();
});
