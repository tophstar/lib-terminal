define([], function () {

    return function (module) {

        module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

            var LocationCommandHandler = {};

            LocationCommandHandler.command = 'location';
            LocationCommandHandler.description = ['Provides the location of the wedding events'];

            LocationCommandHandler.handle = function (session, cmd) {
                var outText = [
                    '\n\n  >>>>>><<<<<<\n  The Ceremony\n  >>>>>><<<<<<\n\n' +
                    '  The wedding ceremony will be held at 1:00 pm on August 18th at the Eugene Zendo located at: \n' +
                    '  2190 Garfield St,\n  Eugene, OR 97405 \n\n' +
                    '  >>>>>>><<<<<<\n  The Reception\n  >>>>>>><<<<<<\n\n' +
                    '  The reception be on the same day August 18th at 6:00 pm at the Sweet Cheeks Winery.\n' +
                    '  The winery is located 15 minutes outside Eugene at:\n' +
                    '  27007 Briggs Hill Rd,\n  Eugene, OR 97405\n\n'];

                session.output.push({ output: true, text: outText, breakLine: true });
            };

            $commandBrokerProvider.appendCommandHandler(LocationCommandHandler);
        }]);
    };
});