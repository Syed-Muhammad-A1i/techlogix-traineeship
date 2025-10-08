/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
define(['ojs/ojcomposite', 'text!./account-number-view.html', './account-number-viewModel', 'text!./component.json', 'css!./account-number-styles.css'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('account-number', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);