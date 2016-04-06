define([], function () {

    return function (module) {

        module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

            var LocationCommandHandler = {};

            LocationCommandHandler.command = 'location';
            LocationCommandHandler.description = ['Povides the location of the wedding events'];

            LocationCommandHandler.handle = function (session, cmd) {
                var outText = ["The wedding will take place at the Eugene Zendo..."];

                session.output.push({ output: true, text: outText, breakLine: true });
            };

            $commandBrokerProvider.appendCommandHandler(LocationCommandHandler);
        }]);
    };
});