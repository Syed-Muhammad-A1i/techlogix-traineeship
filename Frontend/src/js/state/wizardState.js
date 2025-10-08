define(['knockout'], function(ko) {
  // Shared observables that all pages can read/write
  const wizardState = {
    cnic: ko.observable(''),
    accountType: ko.observable(''),
    accountNumber: ko.observable(''),
    accno: ko.observable(''),
    iban: ko.observable(''),
    selectedOption: ko.observable('accountNumber'),
    username: ko.observable(''),
    // password: ko.observable(''),
    accountTitle: ko.observable(''), // New observable for account title
    phoneNumber: ko.observable('') // New observable for phone number
  };

  // Persist to sessionStorage so data is not lost on refresh
  function saveState() {
    const state = {
      cnic: wizardState.cnic(),
      accountType: wizardState.accountType(),
      accountNumber: wizardState.accountNumber(),
      accno: wizardState.accno(),
      iban: wizardState.iban(),
      selectedOption: wizardState.selectedOption(),
      username: wizardState.username(),
      // password: wizardState.password(),
      accountTitle: wizardState.accountTitle(),
      phoneNumber: wizardState.phoneNumber()
    };
    sessionStorage.setItem('wizardState', JSON.stringify(state));
  }

  function loadState() {
    const stored = sessionStorage.getItem('wizardState');
    if (stored) {
      const parsed = JSON.parse(stored);
      wizardState.cnic(parsed.cnic || '');
      wizardState.accountType(parsed.accountType || '');
      wizardState.accountNumber(parsed.accountNumber || '');
      wizardState.accno(parsed.accno || '');
      wizardState.iban(parsed.iban || '');
      wizardState.selectedOption(parsed.selectedOption || 'accountNumber');
      wizardState.username(parsed.username || '');
      // wizardState.password(parsed.password || '');
      wizardState.accountTitle(parsed.accountTitle || '');
      wizardState.phoneNumber(parsed.phoneNumber || '');
    }
  }

  // ✅ Clear all data from observables + sessionStorage
  wizardState.clear = function() {
    wizardState.cnic('');
    wizardState.accountType('');
    wizardState.accountNumber('');
    wizardState.accno('');
    wizardState.iban('');
    wizardState.selectedOption('accountNumber');
    wizardState.username('');
    // wizardState.password('');
    wizardState.accountTitle('');
    wizardState.phoneNumber('');
    sessionStorage.removeItem('wizardState');
  };
  
  // Automatically load on module import
  loadState();

  // Automatically save whenever any observable changes
  Object.values(wizardState).forEach(obs => {
    if (ko.isObservable(obs)) obs.subscribe(saveState);
  });

  return wizardState;
});
