define(['knockout'], function (ko) {
  function WizardState() {
    this.userName = ko.observable("");
    this.cnic = ko.observable("");
    // this.address = ko.observable("");
    this.accountNumber = ko.observable("");
    this.iban = ko.observable("");
    this.selectedOption = ko.observable("accountNumber");
  }
  return new WizardState(); // singleton instance
});
