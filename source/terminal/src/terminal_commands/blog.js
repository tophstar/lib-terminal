(function (global) {
    define([], function () {
        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

                var LocationCommandHandler = {};

                LocationCommandHandler.command = 'Blog';
                LocationCommandHandler.description = ['Links to my blog.'];

                LocationCommandHandler.handle = function (session, cmd) {
                    var outText = ["Would you like to be redirected to my blog?" +
                    "\n\n  If a new tab does not open, the website address is:" +
                    "\n\n  https://www.tophstar.com/wordsofadev"];

                    session.output.push({ output: true, text: outText, breakLine: true });
                };

                $commandBrokerProvider.appendCommandHandler(LocationCommandHandler);
            }]);
        };
    })
}(window));