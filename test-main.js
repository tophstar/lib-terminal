var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',

    paths: {
        "angular": "bower_components/angular/angular",
        "bootstrap": "bower_components/angular-bootstrap/ui-bootstrap",
        "dialogs": "bower_components/dialogs/dialogs",
        "rangeslider": "bower_components/angular-rangeslider/angular.rangeSlider",
        "swfobject": "bower_components/swfobject/swfobject/src/swfobject",
        "modernizr": "bower_components/modernizr/modernizr",
        "device" : "bower_components/device/device",
        "touch": "bower_components/angular-touch/angular-touch"
    },

    shim: {
        "swfobject": {deps: [], exports: "swfobject"},
        "angular": {deps: [], exports: "angular"},
        "bootstrap": {deps: ["angular"], exports: "bootstrap"},
        "dialogs": {deps: ["angular", "bootstrap"], exports: "dialogs"},
        "rangeslider": {deps: ["angular"], exports: "rangeslider"},
        "modernizr": {deps: [], exports: "Modernizr"},
        "device": {deps: [], exports: "device"},
        "touch": {deps: ["angular"], exports: "touch"}
    },

    priority: [
        "angular",
        "bootstrap",
        "dialogs",
        "rangeslider",
        "swfobject",
        "modernizr",
        "device",
        "touch"
    ],

  // dynamically load all test files
  deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  callback: window.__karma__.start
});
