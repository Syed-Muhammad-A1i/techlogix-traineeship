
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
        
    }

    return tncViewModel;
});