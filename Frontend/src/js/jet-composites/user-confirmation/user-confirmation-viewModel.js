define(
  ['knockout', 'ojL10n!./resources/nls/user-confirmation-strings', 'ojs/ojcontext', 'ojs/ojknockout', 'state/wizardState'],
  function (ko, componentStrings, Context, ojknockout, wizardState) {
    function SuccessViewModel() {
      var self = this;

      // Pull data from shared state
      self.username = wizardState.username;
      self.accountTitle = wizardState.accountTitle;
      self.accountNumber = wizardState.accountNumber;


      self.continueToLogin = function() {
        // Clear wizard state
        wizardState.clear();
        self.nextButtonClick();
  
       };

       self.nextButtonClick = function() {
          document.dispatchEvent(new CustomEvent('navigation', {
            detail: {
              action: 'next',
              from: 6
            },
            bubbles: true  // This ensures the event bubbles up
          }));
        };
    }


    return SuccessViewModel;
  }
);
