
define(['ojs/ojcore', 'knockout', 'state/wizardState'], function(oj, ko, wizardState) {
    'use strict';
    
    function tncViewModel() {
        var self = this;
        console.log('hello');

        // Next button click handler in your component
        self.nextButtonClick = function() {
            
          document.dispatchEvent(new CustomEvent('navigation', {
            detail: {
              action: 'next',
              from: 5
            },
            bubbles: true  // This ensures the event bubbles up
          }));
        };

        // Back button click handler in your component
        self.backButtonClick = function() {
          document.dispatchEvent(new CustomEvent('navigation', {
            detail: {
              action: 'previous', 
              from: 5
            },
            bubbles: true
          }));
        };
                // Progress Steps Configuration
        // self.steps = ko.observableArray([
        //     { number: 1, title: 'Account Type' },
        //     { number: 2, title: 'Account Details' },
        //     { number: 3, title: 'Verification' },
        //     { number: 4, title: 'Login Details' }
        // ]);

        // self.currentStep = ko.observable(4); // Current active step
        
        wizardState.currentStep(4); // Ensure wizardState is synced

        // Previous Step function
        self.previousStep = function () {
            self.backButtonClick();
        };

        // Next Step function with validation
        self.nextStep = async function () {
            // If validation passes, go to next step
            // Prepare data for backend
            const payload = {
                username: wizardState.username(),
                password: wizardState.password(),
                phone_number: wizardState.phoneNumber()
            };

            const accountNumber = wizardState.accountNumber();

            try {
                const response = await fetch(`http://localhost:8081/api/accounts/${accountNumber}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error("❌ Failed to update login details");
                }

                const result = await response.json();
                console.log("✅ Login details updated:", result);

                alert("✅ Account setup completed successfully!");
                self.nextButtonClick();

            } catch (error) {
                console.error("Error saving login details:", error);
                alert("⚠️ Unable to save details. Please try again.");
            }
            // self.nextButtonClick();
            
        };
        
    }

    return tncViewModel;
});