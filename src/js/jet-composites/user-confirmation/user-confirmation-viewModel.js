/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
'use strict';
define(
    ['knockout', 'ojL10n!./resources/nls/user-confirmation-strings', 'ojs/ojcontext', 'ojs/ojknockout'], function (ko, componentStrings, Context) {
    // Next button click handler in your component
    self.nextButtonClick = function() {
      document.dispatchEvent(new CustomEvent('navigation', {
        detail: {
          action: 'next',
          from: 'page6'
        },
        bubbles: true  // This ensures the event bubbles up
      }));
    };

    // Back button click handler in your component
    self.backButtonClick = function() {
      document.dispatchEvent(new CustomEvent('navigation', {
        detail: {
          action: 'previous', 
          from: 'page6'
        },
        bubbles: true
      }));
    };
    function SuccessViewModel() {
    var self = this;
    self.username = ko.observable('03221234567');
    self.accountTitle = ko.observable('ALI KHAN');
    self.accountNumber = ko.observable('01535400052790');
    }

    ;

    return SuccessViewModel;
});
