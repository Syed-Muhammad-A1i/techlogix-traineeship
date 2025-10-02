/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';
define(
    ['knockout', 'ojL10n!./resources/nls/user-confirmation-strings', 'ojs/ojcontext', 'ojs/ojknockout' , 'state/wizardState'], function (ko, wizardState, componentStrings, Context) {
    
    function SuccessViewModel() {
      var self = this;
      self.username = ko.observable('03221234567');
      self.accountTitle = ko.observable('ALI KHAN');
      self.accountNumber = wizardState.accountNumber;

      console.log(wizardState.accountNumber);
      
    }

    

    return SuccessViewModel;
});
