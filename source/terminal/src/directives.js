(function (global) {
  var Directives = function (module) {
    global.angular.forEach(Directives.list, function (directive) {
      module.directive(directive['NAME'], directive);
    });
  };

  define([
    "./directives/scrubber-tooltip"
  ], function (
    ScrubberTooltip
    ) {
    Directives.list = arguments;
    return Directives;
  });
}(window));