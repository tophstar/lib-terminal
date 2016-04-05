(function (global) {
  var Services = function (module) {
    global.angular.forEach(Services.list, function (service) {
      module.factory(service['NAME'], service);
    });
  };

  define([
//    "angular",
//    "./services/command-line-splitter",
//    "./services/command-broker",
    "./services/prompt-creator",
    "./services/terminal-configuration",
  ], function (
//    angular,
//    CommandLineSplitter,
    //CommandBroker, 
    PromptCreator,
    TerminalConfiguration) {
//    Services.angular = angular;
    Services.list = arguments;
    return Services;
  });
}(window));