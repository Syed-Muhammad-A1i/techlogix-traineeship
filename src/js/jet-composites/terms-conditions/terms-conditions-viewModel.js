
define(['ojs/ojcore', 'knockout', 'jquery'], function(oj, ko, $) {
    'use strict';
    
    function tncViewModel() {
        var self = this;
                // Progress Steps Configuration
        self.steps = ko.observableArray([
            { number: 1, title: 'Account Type' },
            { number: 2, title: 'Account Details' },
            { number: 3, title: 'Verification' },
            { number: 4, title: 'Login Details' }
        ]);

        self.currentStep = ko.observable(4); // Current active step

        // Function to go to next step
        self.goToNextStep = function() {
            if (self.currentStep() < self.steps().length) {
                self.currentStep(self.currentStep() + 1);
            }
        };

        // Function to go to previous step
        self.goToPreviousStep = function() {
            if (self.currentStep() > 1) {
                self.currentStep(self.currentStep() - 1);
            }
        };

        // Previous Step function
        self.previousStep = function () {
            self.goToPreviousStep();
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
            self.goToNextStep();
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
            
            oj.Logger.info("tncViewModel disposed");
        };
    }

    return tncViewModel;
});