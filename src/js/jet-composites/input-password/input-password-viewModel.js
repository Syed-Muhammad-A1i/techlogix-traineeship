/**
 * Password Step ViewModel for Oracle JET Account Opening Wizard
 */
define(['ojs/ojcore', 'knockout', 'jquery'], function(oj, ko, $) {
    'use strict';
    
    function PasswordStepViewModel() {
        var self = this;
        self.next = context.properties['nextCallback'];
        self.back = context.properties['backCallback'];
        // Observable for selected option
        self.selectedOption = ko.observable('accountNumber');
        
        // Observable for account number
        self.accountNumber = ko.observable('');
        
        // Observable for IBAN
        self.iban = ko.observable('');
        
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

        // Password observables
        self.password = ko.observable('');
        self.confirmPassword = ko.observable('');
        
        // Show/Hide password observables
        self.showPassword = ko.observable(false);
        self.showConfirmPassword = ko.observable(false);
        
        // Toggle functions for show/hide password
        self.toggleShowPassword = function() {
            self.showPassword(!self.showPassword());
        };
        
        self.toggleShowConfirmPassword = function() {
            self.showConfirmPassword(!self.showConfirmPassword());
        };
        
        // Password strength calculation
        self.strength = ko.computed(function() {
            var pwd = self.password();
            if (pwd.length === 0) return 0;
            
            var strength = 0;
            
            // Length check
            if (pwd.length >= 8) strength += 1;
            
            // Contains both lowercase and uppercase
            if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 1;
            
            // Contains numbers
            if (/\d/.test(pwd)) strength += 1;
            
            // Contains special characters
            if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
            
            return strength;
        });
        
        // Strength percentage for visual indicator
        self.strengthPercentage = ko.computed(function() {
            var strength = self.strength();
            return Math.min((strength / 4) * 100, 100);
        });
        
        // Strength text and class
        self.strengthText = ko.computed(function() {
            var strength = self.strength();
            if (strength === 0) return '';
            if (strength <= 1) return 'Weak';
            if (strength <= 2) return 'Medium';
            return 'Strong';
        });
        
        self.strengthClass = ko.computed(function() {
            var strength = self.strength();
            if (strength === 0) return '';
            if (strength <= 1) return 'weak';
            if (strength <= 2) return 'medium';
            return 'strong';
        });
        
        // Password input border class based on strength
        self.passwordBorderClass = ko.computed(function() {
            var strength = self.strength();
            if (strength === 0) return '';
            if (strength <= 1) return 'password-weak';
            if (strength <= 2) return 'password-medium';
            return 'password-strong';
        });
        
        // Password match status
        self.passwordsMatch = ko.computed(function() {
            return self.password() === self.confirmPassword() && self.password().length > 0;
        });
        
        self.matchText = ko.computed(function() {
            return self.passwordsMatch() ? 'Password Matched' : 'Password Not Matched';
        });
        
        self.matchClass = ko.computed(function() {
            return self.passwordsMatch() ? 'matched' : 'not-matched';
        });
        
        self.matchIcon = ko.computed(function() {
            return self.passwordsMatch() ? '✓' : '✗';
        });
        
        // Confirm password input border class based on match status
        self.confirmPasswordBorderClass = ko.computed(function() {
            if (self.confirmPassword().length === 0) return '';
            return self.passwordsMatch() ? 'password-match-border' : 'password-mismatch-border';
        });
        
        // Form validation
        self.isFormValid = ko.computed(function() {
            return self.password().length >= 8 && self.passwordsMatch();
        });
        
        // Updated Button Functions
        self.previousStep = function () {
            self.goToPreviousStep();
        };

        self.nextStep = function () {
            if (!self.passwordsMatch()) {
                alert("⚠️ Please ensure passwords match.");
                return;
            }
            
            // If validation passes, go to next step
            self.goToNextStep();
            alert("✅ Proceeding to next step!");
        };
        
        /**
         * ViewModel lifecycle methods for Oracle JET
         */
        self.activate = function(context) {
            return Promise.resolve();
        };
        
        self.deactivate = function() {
            return Promise.resolve();
        };
        
        self.dispose = function() {
            // Cleanup computed observables
            const computeds = [
                'strength', 'strengthPercentage', 'strengthText', 'strengthClass',
                'passwordBorderClass', 'passwordsMatch', 'matchText', 'matchClass',
                'matchIcon', 'confirmPasswordBorderClass', 'isFormValid'
            ];
            
            computeds.forEach(computedName => {
                if (self[computedName] && self[computedName].dispose) {
                    self[computedName].dispose();
                }
            });
        };
    }
    
    return PasswordStepViewModel;
});