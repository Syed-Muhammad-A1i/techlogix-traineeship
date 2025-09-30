
define(['ojs/ojcore', 'knockout', 'jquery'], function(oj, ko, $) {
    'use strict';
    
    function tncViewModel() {
        var self = this;

        // Next button click handler in your component
        self.nextButtonClick = function() {
            console.log('hello');
            
          document.dispatchEvent(new CustomEvent('navigation', {
            detail: {
              action: 'next',
              from: 'page5'
            },
            bubbles: true  // This ensures the event bubbles up
          }));
        };

        // Back button click handler in your component
        self.backButtonClick = function() {
          document.dispatchEvent(new CustomEvent('navigation', {
            detail: {
              action: 'previous', 
              from: 'page5'
            },
            bubbles: true
          }));
        };
                // Progress Steps Configuration
        self.steps = ko.observableArray([
            { number: 1, title: 'Account Type' },
            { number: 2, title: 'Account Details' },
            { number: 3, title: 'Verification' },
            { number: 4, title: 'Login Details' }
        ]);

        self.currentStep = ko.observable(4); // Current active step
    
        // Previous Step function
        self.previousStep = function () {
            self.backButtonClick();
        };

        // Next Step function with validation
        self.nextStep = function () {            
            // If validation passes, go to next step
            self.nextButtonClick();
            
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