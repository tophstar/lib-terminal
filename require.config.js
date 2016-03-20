requirejs.config({
  baseUrl: "./source",
  dir: "./build",
  waitSeconds: 15,
  optimize: "none",
  optimizeCss: false,
  inlineText: false,
  isBuild: true,
  fileExclusionRegExp: /^\.|\.md$/,

  paths: {
    "angular": "bower_components/angular/angular",
    "bootstrap": "bower_components/angular-bootstrap/ui-bootstrap",
    "dialogs": "bower_components/dialogs/dialogs"
  },

  shim: {
    "angular": {deps: [], exports: "angular"},
    "bootstrap": {deps: ["angular"], exports: "bootstrap"},
    "dialogs": {deps: ["angular", "bootstrap"], exports: "dialogs"}
  },

  priority: [
    "angular",
    "bootstrap",
    "dialogs"
  ],

  modules: [
    {name: "terminal"}
  ]
});
