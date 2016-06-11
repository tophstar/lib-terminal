define([], function () {

    return function (module) {

        module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

            var LocationCommandHandler = {};

            LocationCommandHandler.command = 'registry';
            LocationCommandHandler.description = ['Links to the weding registry.'];

            LocationCommandHandler.handle = function (session, cmd) {
                var outText = ["Would you like to see the Wedding Registry?" +
                "\n\n  If a new tab does not open, the website address is:" +
                "\n\n  https://www.wanderable.com/hm/leslieandchristopher"];

                session.output.push({ output: true, text: outText, breakLine: true });
            };

            $commandBrokerProvider.appendCommandHandler(LocationCommandHandler);
        }]);
    };
});