/**
 * Account Details ViewModel for Oracle JET
 */
define(['ojs/ojcore', 'knockout', 'state/wizardState'], function(oj, ko, wizardState, $) {
    'use strict';

    function AccountDetailsViewModel() {
        var self = this;
        
      // Next button click handler in your component
        self.nextButtonClick = function() {
          document.dispatchEvent(new CustomEvent('navigation', {
            detail: {
              action: 'next',
              from: 'page2'
            },
            bubbles: true  // This ensures the event bubbles up
          }));
        };

        // Back button click handler in your component
        self.backButtonClick = function() {
          document.dispatchEvent(new CustomEvent('navigation', {
            detail: {
              action: 'previous', 
              from: 'page2'
            },
            bubbles: true
          }));
        };
        
        // Observable for selected option
        self.selectedOption = ko.observable('accountNumber');
        
        // Observable for account number
        self.accountNumber = wizardState.accountNumber;
        
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

        // Previous Step function
        self.previousStep = function () {
            self.backButtonClick();
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
            self.nextButtonClick();
            oj.Logger.info("Proceeding with Account Number: " + self.formattedAccountNumber());
        };
        
        
    }
    
    return AccountDetailsViewModel;
});