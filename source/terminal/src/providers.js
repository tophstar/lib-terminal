(function (global) {
  var Providers = function (module) {
    global.angular.forEach(Providers.list, function (aprovider) {
      module.provider(aprovider['NAME'], aprovider);
    });

    module.run(['$commandBroker', function(theprovider) {
        theprovider.init();
      }]);
  };

  define([
//    "angular",
    "./providers/command-line-splitter",
    "./providers/command-broker"
  ], function (
//    angular,
    CommandLineSplitter,
    CommandBroker
    ) {
//    Providers.angular = angular;
    Providers.list = arguments;
    return Providers;
  });
}(window));