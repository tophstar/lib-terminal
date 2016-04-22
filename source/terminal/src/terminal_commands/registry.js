define([], function () {

    return function (module) {

        module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

            var LocationCommandHandler = {};

            LocationCommandHandler.command = 'registry';
            LocationCommandHandler.description = ['Links to the weding registry.'];

            LocationCommandHandler.handle = function (session, cmd) {
                var outText = ["Would you like to see the Wedding Registry?  (It will open in a new tab)"];

                session.output.push({ output: true, text: outText, breakLine: true });
            };

            $commandBrokerProvider.appendCommandHandler(LocationCommandHandler);
        }]);
    };
});