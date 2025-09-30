/**
 * Username Step ViewModel for Oracle JET Account Opening Wizard
 */
define(['ojs/ojcore', 'knockout', 'jquery'], function(oj, ko, $) {
    'use strict';
    
    function UsernameStepViewModel() {
        var self = this;
        
        // Observable for username
        self.username = ko.observable("");
        
        // Observable for selected option (if needed for this step)
        self.selectedOption = ko.observable('accountNumber');
        
        // Next button click handler in your component
        self.nextButtonClick = function() {
          document.dispatchEvent(new CustomEvent('navigation', {
            detail: {
              action: 'next',
              from: 'page3'
            },
            bubbles: true  // This ensures the event bubbles up
          }));
        };

        // Back button click handler in your component
        self.backButtonClick = function() {
          document.dispatchEvent(new CustomEvent('navigation', {
            detail: {
              action: 'previous', 
              from: 'page3'
            },
            bubbles: true
          }));
        };


        // Function to select option
        self.selectOption = function(option) {
            self.selectedOption(option);
        };

        // Progress Steps Configuration
        self.steps = ko.observableArray([
            { number: 1, title: 'Account Type' },
            { number: 2, title: 'Account Details' },
            { number: 3, title: 'Verification' },
            { number: 4, title: 'Login Details' }
        ]);

        self.currentStep = ko.observable(4); // Current active step

        // Username validation
        self.isValid = ko.computed(function() {
            return self.username().length >= 8 && self.username().length <= 16;
        });
        
        // Username validation message
        self.validationMessage = ko.computed(function() {
            if (self.username().length === 0) {
                return 'Please enter a username';
            } else if (self.username().length < 8) {
                return 'Username must be at least 8 characters';
            } else if (self.username().length > 16) {
                return 'Username cannot exceed 16 characters';
            } else {
                return 'Username available!';
            }
        });
        
        // Validation state for UI styling
        self.validationState = ko.computed(function() {
            if (self.username().length === 0) {
                return 'default';
            }
            return self.isValid() ? 'valid' : 'invalid';
        });
        
        // Show status icon when valid
        self.showStatusIcon = ko.computed(function() {
            return self.isValid() && self.username().length > 0;
        });

        // Previous Step function
        self.previousStep = function () {
            self.backButtonClick();
        };

        // Next Step function with validation
        self.nextStep = function () {
            if (!self.isValid()) {
                // Use Oracle JET dialog or logger instead of alert
                oj.Logger.error("Please enter a valid username (8-16 characters).");
                
                // Optionally show an Oracle JET message
                if (typeof self.showMessage === 'function') {
                    self.showMessage({
                        severity: 'error',
                        summary: 'Validation Error',
                        detail: 'Please enter a valid username (8-16 characters).',
                        autoTimeout: 5000
                    });
                }
                return;
            }
            
            // If validation passes, go to next step
            self.nextButtonClick();
            oj.Logger.info("Proceeding with Username: " + self.username());
            
            // Optionally show success message
            if (typeof self.showMessage === 'function') {
                self.showMessage({
                    severity: 'confirmation',
                    summary: 'Success',
                    detail: 'Username validated successfully!',
                    autoTimeout: 3000
                });
            }
        };
        
        /**
         * Optional: Reset function to clear form
         */
        self.resetForm = function() {
            self.username("");
        };
        
        /**
         * ViewModel lifecycle methods for Oracle JET
         */
        
        // Called when ViewModel is activated
        self.activate = function(context) {
            // Implementation for activation if needed
            oj.Logger.info("UsernameStepViewModel activated");
            return Promise.resolve();
        };
        
        // Called when ViewModel is transitioning away
        self.deactivate = function() {
            // Cleanup if needed
            oj.Logger.info("UsernameStepViewModel deactivated");
            return Promise.resolve();
        };
        
        /**
         * Optional: Message handling for Oracle JET messages
         */
        self.messageManager = ko.observable(null);
        
        // Function to show messages
        self.showMessage = function(message) {
            if (self.messageManager()) {
                self.messageManager().addMessage(message);
            } else {
                // Fallback to console
                console[message.severity === 'error' ? 'error' : 'log'](message.detail);
            }
        };
        
        // Called when ViewModel is disposed
        self.dispose = function() {
            // Cleanup computed observables
            if (self.isValid && self.isValid.dispose) {
                self.isValid.dispose();
            }
            if (self.validationMessage && self.validationMessage.dispose) {
                self.validationMessage.dispose();
            }
            if (self.validationState && self.validationState.dispose) {
                self.validationState.dispose();
            }
            if (self.showStatusIcon && self.showStatusIcon.dispose) {
                self.showStatusIcon.dispose();
            }
            
            oj.Logger.info("UsernameStepViewModel disposed");
        };
    }
    
    return UsernameStepViewModel;
});