(function (global) {
  var Directives = function (module) {
    global.angular.forEach(Directives.list, function (directive) {
      module.directive(directive['NAME'], directive);
    });
  };

  define([
    "./directives/rsvp-edit",
    "./directives/terminal-output"
  ], function (
    RSVPEdit,
    TerminalOutput
    ) {
    Directives.list = arguments;
    return Directives;
  });
}(window));