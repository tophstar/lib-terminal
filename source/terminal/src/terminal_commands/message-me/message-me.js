(function (global) {
    define([], function () {
        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $scope) {

                var LocationCommandHandler = {};

                LocationCommandHandler.command = 'Messanger';
                LocationCommandHandler.description = ['Provide a way to message me.'];

                LocationCommandHandler.handle = function (session, cmd, scope) {
                    //Show view/edit directive

                    var outText = [
                        'Do you want to leave me a message?'
                        ];

                    session.output.push({ output: true, text: outText, breakLine: true });
                };

                $commandBrokerProvider.appendCommandHandler(LocationCommandHandler);
            }]);
        };
    });
}(window));