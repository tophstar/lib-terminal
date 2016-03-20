/* global addResizeListener, alert */
(function (global) {
  var TermCtrl = function ($scope, $document, $sce, $terminalOptions, $terminalErrors, $timeout) {
    var angular = TermCtrl.angular,
      require = TermCtrl.require,
      terminalContainer = $terminalOptions.getTerminalContainer(),
      getResourceUrl = TermCtrl.getResourceUrl($scope);

    $scope.options = $terminalOptions;
    $scope.terminalContainer = terminalContainer;

    $scope.baseUrl = require.toUrl("");

    function broadcast(event) {
        $scope.$broadcast("term_" + event);
    }

    var self = {

      terminalApi: function terminalApi() {
        return {
          onError: function onError(callback) { $terminalOptions.setOnError(callback); },
        };
      }
    };

    return self;
  };

  define([
    "angular"
  ], function (angular) {

    TermCtrl.require = global.require;
    TermCtrl.angular = angular;
    TermCtrl.NAME = "TermCtrl";
    TermCtrl.$inject = ["$scope", "$document", "$sce", "$terminalOptions", "$terminalErrors", "$timeout"];
    return TermCtrl;
  });
}(window));
