define([], function () {

    return function (module) {

        module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

            var RSVPAuthCommandHandler = {};

            RSVPAuthCommandHandler.command = 'RSVP Auth';
            RSVPAuthCommandHandler.description = ['RSVP Authentication Step'];
            RSVPAuthCommandHandler.parentCommand = 'rsvp';

            RSVPAuthCommandHandler.handle = function (session, cmd) {
                var outText = [];

                //attempt to auth with a get request

                if(cmd === "true"){
                    outText.push("Please enter your email");
                }
                else{

                }

               
                session.output.push({ output: true, text: outText, breakLine: true });
            };
            
            $commandBrokerProvider.appendChildCommandHandler(RSVPAuthCommandHandler);

        }]);
    };
});