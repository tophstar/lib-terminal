(function (global) {
  var Directives = function (module) {
    global.angular.forEach(Directives.list, function (directive) {
      module.directive(directive['NAME'], directive);
    });
  };

  define([
    "./directives/terminal-output"
  ], function (
    TerminalOutput
    ) {
    Directives.list = arguments;
    return Directives;
  });
}(window));