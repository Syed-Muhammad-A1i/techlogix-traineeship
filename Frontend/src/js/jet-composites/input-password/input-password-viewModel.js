/**
 * Password Step ViewModel for Oracle JET Account Opening Wizard
 */
define(['ojs/ojcore', 'knockout', 'state/wizardState', 'service/toastService'], function(oj, ko, wizardState, toastService) {
    'use strict';
    
    function PasswordStepViewModel() {
        var self = this;

        self.toastService = toastService;
        
        // Next button click handler in your component
        self.nextButtonClick = function() {
          document.dispatchEvent(new CustomEvent('navigation', {
            detail: { action: 'next', from: 4 },
            bubbles: true
          }));
        };

        // Back button click handler in your component
        self.backButtonClick = function() {
          document.dispatchEvent(new CustomEvent('navigation', {
            detail: { action: 'previous', from: 4 },
            bubbles: true
          }));
        };
        
        wizardState.currentStep(4); // Ensure wizardState is synced

        // Password observables
        self.password = ko.observable('');
        self.confirmPassword = ko.observable('');
        
        // Show/Hide password observables
        self.showPassword = ko.observable(false);
        self.showConfirmPassword = ko.observable(false);
        
        // Toast observables
        self.toastMessage = ko.observable('');
        self.showToast = ko.observable(false);

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
            if (pwd.length >= 8) strength += 1;
            if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 1;
            if (/\d/.test(pwd)) strength += 1;
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

        //  Helper: Check if password is alphanumeric
        self.isAlphanumeric = function(pwd) {
            return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&#^()_+\-={}\[\]:;"'<>,.~`|\\\/]+$/.test(pwd);

        };

        //  Helper: Hash password using SHA-256
        self.hashPassword = async function(password) {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        };

        
        // Updated Button Functions
        self.previousStep = function () {
            self.backButtonClick();
        };

        
        self.nextStep = async function () {
            const pwd = self.password();
            const strength = self.strength();

            //  Empty password check
            if (!pwd) {
                toastService.showToastMessage('Password cannot be empty.', 'error');
                return;
            }

            //  Non-alphanumeric check
            if (!self.isAlphanumeric(pwd)) {
                toastService.showToastMessage("Password must be alphanumeric.", "error");
                return;
            }

            //  Weak password check (strength <= 1 means weak)
            if (strength <= 1) {
                toastService.showToastMessage("Password is too weak. Please make it stronger (use letters + numbers, min 8 chars).", "error");
                return;
            }

            //  Password match check
            if (!self.passwordsMatch()) {
                toastService.showToastMessage("Please ensure passwords match.", "error");
                return;
            }
            
            const hashedPassword = await self.hashPassword(pwd);
            console.log("Hashed Password:", hashedPassword);
            //  Passed all checks — proceed
            wizardState.password(hashedPassword);
            self.nextButtonClick();
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
