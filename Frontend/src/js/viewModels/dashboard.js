define(['knockout', 
  'state/wizardState',
  '../jet-composites/account-type/loader', 
  '../jet-composites/account-number/loader', 
  '../jet-composites/input-username/loader', 
  '../jet-composites/input-password/loader', 
  '../jet-composites/terms-conditions/loader',
  '../jet-composites/user-confirmation/loader',
  '../jet-composites/login-page/loader'
  
], function(ko, wizardState) {
  function AppControllerViewModel() {
    var self = this;

    // -------------------------
    // Step tracking
    // -------------------------
    self.steps = ko.observableArray([
      { number: 1, title: 'Account Type' },
      { number: 2, title: 'Account Details' },
      { number: 3, title: 'Verification' },
      { number: 4, title: 'Login Details' }
    ]);

    // Current visible page
    self.currentStep = wizardState.currentStep; // Start at step 1;

    self.currentPage = ko.observable(1); // Start at page1
    // Define page order
    self.pageOrder = [1, 2, 3, 4, 5, 6, 7];
    
    // Go directly to page
    self.goToPage = function(page) {
      self.currentPage(page);
    };

    // Next page
    self.nextPage = function() {
      var currentIndex = self.pageOrder.indexOf(self.currentPage());
      if (currentIndex < self.pageOrder.length ) {
        self.currentPage(self.pageOrder[currentIndex + 1]);
      }
    };

    // Previous page
    self.previousPage = function() {
      var currentIndex = self.pageOrder.indexOf(self.currentPage());
      if (currentIndex > 0) {
        self.currentPage(self.pageOrder[currentIndex - 1]);
      }
    };

    // Handle navigation events from components
    self.handleNavigation = function(event) {
      var detail = event.detail;
      if (!detail) return;
      
      if (detail.action === 'next') {
        self.nextPage();
      } else if (detail.action === 'previous') {
        self.previousPage();
      } else if (detail.action === 'goto') {
        self.goToPage(detail.page);
      }
    }.bind(self); // Important: bind the context

    // Add event listener when view model is created
    self.connected = function() {
      document.addEventListener('navigation', self.handleNavigation);
    };

    // Remove event listener when view model is disposed (optional but good practice)
    self.disconnected = function() {
      document.removeEventListener('navigation', self.handleNavigation);
    };

    // expose for index.html
    self.moduleConfig = ko.observable({ view: 'views/appController.html', viewModel: self });
  }

  return new AppControllerViewModel();
});