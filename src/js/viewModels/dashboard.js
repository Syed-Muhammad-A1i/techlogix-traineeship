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
    self.pages = ['page1','page2','page3','page4','page5','page6'];

    self.currentPageIndex = ko.observable(0); 
    self.currentPage = ko.computed(function() {
      return self.pages[self.currentPageIndex()];
    });

    self.nextPage = function() {
      console.log("Next from AppController")
      if (self.currentPageIndex() < self.pages.length - 1) {
        self.currentPageIndex(self.currentPageIndex() + 1);
      }
    };

    self.previousPage = function() {
      if (self.currentPageIndex() > 0) {
        self.currentPageIndex(self.currentPageIndex() - 1);
      }
    };
  }

  return new AppControllerViewModel();
});
