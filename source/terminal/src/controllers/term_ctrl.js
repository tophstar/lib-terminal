(function () {
  var TermCtrl = function ($scope, $commandBroker, $rootScope, $terminalOptions) {

    $rootScope.theme = 'vintage';


    $scope.session = {
        commands: [],
        output: [],
        $scope:$scope
    };




    $scope.$watchCollection(function () { return $scope.session.commands; }, function (n) {
        for (var i = 0; i < n.length; i++) {
            $scope.$broadcast('terminal-command', n[i]);
        }
        $scope.session.commands.splice(0, $scope.session.commands.length);
        $scope.safeApply();
    });

    $scope.$watchCollection(function () { return $scope.session.output; }, function (n) {
        console.log("session output changed");

        for (var i = 0; i < n.length; i++) {
            $scope.$broadcast('terminal-output', n[i]);
        }
        $scope.session.output.splice(0, $scope.session.output.length);
        $scope.safeApply();
    });



    /**
    * Watch for inputs
    */
    $scope.$on('terminal-input', function (e, consoleInput) {
        var cmd = consoleInput[0];

        try {
            if ($scope.session.context) {
                $scope.session.context.execute($scope.session, cmd.command);
            }
            else {
                $commandBroker.execute($scope.session, cmd.command);
            }
        } catch (err) {
            $scope.session.output.push({ output: true, breakLine: true, text: [err.message] });
        }
    });









    var self = {

      terminalApi: function terminalApi() {
        return {
          onError: function onError(callback) { $terminalOptions.setOnError(callback); },
        };
      }
    };

    return self;
  };

  define([], function () {

    TermCtrl.NAME = "TermCtrl";
    TermCtrl.$inject = ['$scope','$commandBroker','$rootScope', '$terminalOptions'];
    return TermCtrl;
  });
}());
