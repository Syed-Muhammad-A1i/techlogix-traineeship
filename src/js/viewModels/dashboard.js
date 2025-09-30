define(['knockout', 
  '../jet-composites/account-type/loader', 
  '../jet-composites/account-number/loader', 
  '../jet-composites/input-username/loader', 
  '../jet-composites/input-password/loader', 
  '../jet-composites/terms-conditions/loader',
  '../jet-composites/user-confirmation/loader'
], function(ko) {
  function AppControllerViewModel() {
    var self = this;

    // Current visible page
    self.currentPage = ko.observable('page1');

    // Shared state across components
    self.sharedState = {
      accountNumber: ko.observable('Ali'),
      iban: ko.observable(''),
      selectedOption: ko.observable('accountNumber')
    };
    
    // Define page order
    self.pageOrder = ['page1', 'page2', 'page3', 'page4', 'page5', 'page6', 'page7'];
    
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