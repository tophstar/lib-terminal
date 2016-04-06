define([], function () {

    return function (module) {

        module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $q) {

            var RSVPEmailCommandHandler = {};

            RSVPEmailCommandHandler.command = 'RSVPEmail';
            RSVPEmailCommandHandler.description = ['RSVP Email Step'];



            //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
            RSVPEmailCommandHandler.parentCommand = 'RSVPAuth';

            RSVPEmailCommandHandler.handle = function (session, cmd) {
                var outText = [];

                var fakeHttpCall = function(isSuccessful) {

                  var deferred = $q.defer();

                    if(isSuccessful === "true"){
                        outText.push("You have already RSVP'd would you like to see your RSVP status?");
                    }
                    else{
                        outText.push("Would you like to begin the RSVP process?");
                    }

                  return deferred.promise;
                };

                fakeHttpCall(cmd).then(
                  function (data) {
                    // success callback
                    session.output.push({ output: true, text: outText, breakLine: true });
                  },
                  function (err) {
                    // error callback
                    console.log(err);
                  });

            };

            $commandBrokerProvider.appendChildCommandHandler(RSVPEmailCommandHandler);
        }]);
    };
});