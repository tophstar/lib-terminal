define([], function () {

    return function (module) {

        module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

            var LocationCommandHandler = {};

            LocationCommandHandler.command = 'clear';
            LocationCommandHandler.description = ['Clears the screen of all content.'];

            LocationCommandHandler.handle = function (session, cmd, $scope) {
                $scope.results.splice(0, $scope.results.length);
                $scope.safeApply();
            };

            $commandBrokerProvider.appendCommandHandler(LocationCommandHandler);
        }]);
    };
});