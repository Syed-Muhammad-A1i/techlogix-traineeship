// define(['knockout', 'ojs/ojrouter', 'state/wizardState'], function(ko, Router, wizardState) {
//   function Page1ViewModel(context) {
//     var self = this;
    
//     // Next button click handler in your component
//     self.nextButtonClick = function() {
//       document.dispatchEvent(new CustomEvent('navigation', {
//         detail: {
//           action: 'next',
//           from: 'page1'
//         },
//         bubbles: true  // This ensures the event bubbles up
//       }));
//     };

//     // Back button click handler in your component
//     self.backButtonClick = function() {
//       document.dispatchEvent(new CustomEvent('navigation', {
//         detail: {
//           action: 'previous', 
//           from: 'page1'
//         },
//         bubbles: true
//       }));
//     };
        
//     self.steps = ko.observableArray([
//       { number: 1, title: 'Account Type' },
//       { number: 2, title: 'Account Details' },
//       { number: 3, title: 'Verification' },
//       { number: 4, title: 'Login Details' }
//     ]);
//     self.currentStep = ko.observable(1);


//     //Component Functionality Start Here
//     self.cnicNumberRaw = wizardState.cnic; // directly use shared state
//     self.selectedAccountType = wizardState.accountType;
//     // Account types
//     self.accountTypes = ko.observableArray([
//         { id: 1, name: "Individual", defaultImage: "css/images/Individual-Icon-Unfilled.svg", selectedImage: "css/images/Individual-Icon-Filled.svg" },
//         { id: 2, name: "Foreign National", defaultImage: "css/images/Foreign-National-Icon-Unfilled.svg", selectedImage: "css/images/Foreign-National-Icon-Filled.svg" }
//     ]);

//     self.selectAccountType = function(item) {
//       self.selectedAccountType(item.name);
//       wizardState.accountType(item.name); // update shared state
//     };
    
//     // self.cnicNumberRaw = ko.observable("");
//     self.cnicEdited = ko.observable(false);

//     self.formattedCnicNumber = ko.computed({
//       read: function () {
//         let value = self.cnicNumberRaw().replace(/\D/g, "");
//         if (value.length > 13) value = value.substring(0, 13);

//         let part1 = value.substring(0, 5);
//         let part2 = value.substring(5, 12);
//         let part3 = value.substring(12, 13);

//         let formatted = part1;
//         if (part2) formatted += "-" + part2;
//         if (part3) formatted += "-" + part3;

//         return formatted;
//       },
//       write: function (val) {
//         self.cnicNumberRaw(val.replace(/\D/g, ""));
//       }
//     });
    
//     self.isCnicValid = ko.computed(function () {
//       return /^\d{13}$/.test(wizardState.cnic());
//     });
    
//     // Navigation
//     self.previousStep = function() {
//       self.backButtonClick();
//     };
//     self.nextStep = function() {
//       self.cnicEdited(true);
//       if (!self.selectedAccountType()) {
//         alert("⚠️ Please select an account type first.");
//         return;
//       }
//       if (!self.isCnicValid()) {
//         alert("⚠️ Please enter a valid 13-digit CNIC.");
//         return;
//       }

//       self.nextButtonClick();
//     };
//   }

//   return Page1ViewModel;
// });

define(['knockout', 'ojs/ojrouter', 'state/wizardState'], function (ko, Router, wizardState) {
  function Page1ViewModel(context) {
    var self = this;

    // -------------------------
    // Navigation handlers
    // -------------------------
    self.nextButtonClick = function () {
      document.dispatchEvent(new CustomEvent('navigation', {
        detail: { action: 'next', from: 'page1' },
        bubbles: true
      }));
    };

    self.backButtonClick = function () {
      document.dispatchEvent(new CustomEvent('navigation', {
        detail: { action: 'previous', from: 'page1' },
        bubbles: true
      }));
    };

    // -------------------------
    // Step tracking
    // -------------------------
    self.steps = ko.observableArray([
      { number: 1, title: 'Account Type' },
      { number: 2, title: 'Account Details' },
      { number: 3, title: 'Verification' },
      { number: 4, title: 'Login Details' }
    ]);
    self.currentStep = ko.observable(1);

    // -------------------------
    // Shared State (wizardState)
    // -------------------------
    self.cnicNumberRaw = wizardState.cnic; // shared CNIC state
    self.selectedAccountType = wizardState.accountType;

    // -------------------------
    // Account types list
    // -------------------------
    self.accountTypes = ko.observableArray([
      { id: 1, name: "Individual", defaultImage: "css/images/Individual-Icon-Unfilled.svg", selectedImage: "css/images/Individual-Icon-Filled.svg" },
      { id: 2, name: "Foreign National", defaultImage: "css/images/Foreign-National-Icon-Unfilled.svg", selectedImage: "css/images/Foreign-National-Icon-Filled.svg" }
    ]);

    self.selectAccountType = function (item) {
      self.selectedAccountType(item.name);
      wizardState.accountType(item.name); // update shared state
    };

    // -------------------------
    // CNIC formatting
    // -------------------------
    self.cnicEdited = ko.observable(false);

    self.formattedCnicNumber = ko.computed({
      read: function () {
        let value = self.cnicNumberRaw().replace(/\D/g, "");
        if (value.length > 13) value = value.substring(0, 13);

        let part1 = value.substring(0, 5);
        let part2 = value.substring(5, 12);
        let part3 = value.substring(12, 13);

        let formatted = part1;
        if (part2) formatted += "-" + part2;
        if (part3) formatted += "-" + part3;

        return formatted;
      },
      write: function (val) {
        self.cnicNumberRaw(val.replace(/\D/g, ""));
      }
    });

    self.isCnicValid = ko.computed(function () {
      return /^\d{13}$/.test(wizardState.cnic());
    });

    // -------------------------
    // Backend CNIC check
    // -------------------------
    self.isChecking = ko.observable(false);
    self.errorMessage = ko.observable("");

    self.checkCnicInBackend = async function () {
      const cnic = self.cnicNumberRaw();
      if (!self.isCnicValid()) {
        alert("⚠️ Please enter a valid 13-digit CNIC.");
        return false;
      }

      try {
        self.isChecking(true);
        self.errorMessage("");

        const response = await fetch(`http://localhost:8080/api/accounts/${cnic}`);
        if (!response.ok) {
          if (response.status === 404) {
            self.errorMessage("CNIC not found in database.");
            alert("❌ CNIC not found in our records.");
            return false;
          } else {
            alert("⚠️ Server error while checking CNIC.");
            return false;
          }
        }

        const data = await response.json();
        console.log("✅ Account found:", data);

        // Save account details into wizardState for later pages
        wizardState.accountTitle(data.accountTitle);
        wizardState.accountNumber(data.accountNumber);
        wizardState.username(data.phoneNumber);

        console.log("✅ Account Title:", wizardState.accountTitle());
        console.log("✅ Account Number:", wizardState.accountNumber());
        console.log("✅ Phone Number:", wizardState.phoneNumber());

        return true;

      } catch (error) {
        console.error("Error checking CNIC:", error);
        alert("⚠️ Network or server issue. Try again.");
        return false;

      } finally {
        self.isChecking(false);
      }
    };

    // -------------------------
    // Navigation actions
    // -------------------------
    self.previousStep = function () {
      self.backButtonClick();
    };

    self.nextStep = async function () {
      self.cnicEdited(true);

      if (!self.selectedAccountType()) {
        alert("⚠️ Please select an account type first.");
        return;
      }

      const isValid = await self.checkCnicInBackend();
      if (isValid) {
        self.nextButtonClick();
      }
    };
  }

  return Page1ViewModel;
});

