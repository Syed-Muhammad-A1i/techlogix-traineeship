/**
  Copyright (c) 2015, 2025, Oracle and/or its affiliates.
  Licensed under The Universal Permissive License (UPL), Version 1.0
  as shown at https://oss.oracle.com/licenses/upl/

*/
define(['ojs/ojcomposite', 'text!./login-page-view.html', './login-page-viewModel', 'text!./component.json', 'css!./login-page-styles.css'],
  function(Composite, view, viewModel, metadata) {
    Composite.register('login-page', {
      view: view,
      viewModel: viewModel,
      metadata: JSON.parse(metadata)
    });
  }
);