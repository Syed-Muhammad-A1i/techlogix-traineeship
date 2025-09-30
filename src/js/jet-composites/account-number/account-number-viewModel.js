/**
 * Account Details ViewModel for Oracle JET
 */
define(['ojs/ojcore', 'knockout', 'jquery'], function(oj, ko, $) {
    'use strict';

    function AccountDetailsViewModel(context) {
        var self = this;
        self.next = context.properties['nextCallback'];
        self.back = context.properties['backCallback'];        
        
        // Observable for selected option
        self.selectedOption = ko.observable('accountNumber');
        
        // Observable for account number
        self.accountNumber = ko.observable('');
        
        // Observable for IBAN
        self.iban = ko.observable('');
        
        // Track if account number has been edited
        self.accEdited = ko.observable(false);
        
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

        self.currentStep = ko.observable(2); // Current active step

        // Computed for formatted account number
        self.formattedAccountNumber = ko.computed({
            read: function () {
                let value = self.accountNumber().replace(/\D/g, "");
                if (value.length > 13) value = value.substring(0, 14);

                let part1 = value.substring(0, 5);
                let part2 = value.substring(5, 14);

                let formatted = part1;
                if (part2) formatted += "-" + part2;

                return formatted;
            },
            write: function (val) {
                self.accountNumber(val.replace(/\D/g, ""));
            }
        });

        // Validation computed
        self.isAccNoValid = ko.computed(function () {
            return /^\d{14}$/.test(self.accountNumber());
        });
        
        // Validation message computed
        self.validationMessage = ko.computed(function() {
            if (!self.accEdited()) {
                return '';
            }
            return self.isAccNoValid() ? 
                '✅ Account Number Valid' : 
                '❌ Account Number must be 14 digits';
        });
        
        // Validation state for UI styling
        self.validationState = ko.computed(function() {
            if (!self.accEdited()) {
                return 'default';
            }
            return self.isAccNoValid() ? 'valid' : 'invalid';
        });

        // Function to go to next step
        self.goToNextStep = function() {
            if (self.currentStep() < self.steps().length) {
                self.currentStep(self.currentStep() + 1);
            }
            if (typeof self.next === 'function') {
              self.next(); // calls parent AppController.nextPage()
            }
        };

        // Function to go to previous step
        self.goToPreviousStep = function() {
            if (self.currentStep() > 1) {
                self.currentStep(self.currentStep() - 1);
            }
            if (typeof self.back === 'function') {
              self.back();
            }
        };

        // Previous Step function
        self.previousStep = function () {
            self.goToPreviousStep();
        };

        // Next Step function with validation
        self.nextStep = function () {
            self.accEdited(true);
            
            if (!self.isAccNoValid()) {
                // Use Oracle JET dialog instead of alert
                oj.Logger.info("Please enter a valid 14-digit Account Number.");
                return;
            }
            
            // If validation passes, go to next step
            self.goToNextStep();
            oj.Logger.info("Proceeding with Account Number: " + self.formattedAccountNumber());
        };
        
        /**
         * Optional: ViewModel lifecycle methods for Oracle JET
         */
        
        // Called when ViewModel is activated
        self.activate = function(context) {
            // Implementation for activation if needed
            return Promise.resolve();
        };
        
        // Called when ViewModel is transitioning away
        self.deactivate = function() {
            // Cleanup if needed
            return Promise.resolve();
        };
        
        // Called when ViewModel is disposed
        self.dispose = function() {
            // Cleanup computed observables
            self.formattedAccountNumber.dispose();
            self.isAccNoValid.dispose();
            self.validationMessage.dispose();
            self.validationState.dispose();
        };
    }
    
    return AccountDetailsViewModel;
});