var tests = [], specMatcher = /spec\.js$/, file;

for (file in window.__karma__.files) {
  if (specMatcher.test(file)) {
    tests.push(file);
  }
}

requirejs.config({
  // Karma serves files from '/base'
  baseUrl: '/base/source',

  paths: {
    "angular": "/base/bower_components/angular/angular",
    "bootstrap": "/base/bower_components/angular-bootstrap/ui-bootstrap",
    "dialogs": "/base/bower_components/dialogs/dialogs",
    "rangeslider": "/base/bower_components/angular-rangeslider/angular.rangeSlider",
    "swfobject": "/base/bower_components/swfobject/swfobject/src/swfobject",
    "modernizr": "/base/bower_components/modernizr/modernizr"
  },

  shim: {
    "swfobject": {deps: [], exports: "swfobject"},
    "angular": {deps: [], exports: "angular"},
    "bootstrap": {deps: ["angular"], exports: "bootstrap"},
    "dialogs": {deps: ["angular", "bootstrap"], exports: "dialogs"},
    "rangeslider": {deps: ["angular"], exports: "angular"},
    "modernizr": {deps: [], exports: "Modernizr"}
  },

  priority: [
    "angular",
    "bootstrap",
    "dialogs",
    "rangeslider",
    "swfobject",
    "modernizr"
  ],

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});

requirejs.onError = function (err) {
  console.log(err.requireType);
//  if (err.requireType === 'timeout') {
  console.log('modules: ' + err.requireModules);
//  }

  throw err;
};