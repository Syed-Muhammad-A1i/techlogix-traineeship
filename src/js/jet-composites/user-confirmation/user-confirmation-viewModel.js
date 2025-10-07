define(
  ['knockout', 'ojL10n!./resources/nls/user-confirmation-strings', 'ojs/ojcontext', 'ojs/ojknockout', 'state/wizardState'],
  function (ko, componentStrings, Context, ojknockout, wizardState) {
    function SuccessViewModel() {
      var self = this;

      // Pull data from shared state
      self.username = wizardState.username;
      self.accountTitle = ko.observable("ALI KHAN");
      self.accountNumber = wizardState.accountNumber;

      console.log("Account Number:", self.accountNumber());
      console.log("Username:", self.username());
      // console.log("Account Title:", self.accountTitle());
    }

    return SuccessViewModel;
  }
);
