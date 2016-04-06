define([], function () {

    return function (module) {

        module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $q) {

            var RSVPAuthCommandHandler = {};

            RSVPAuthCommandHandler.command = 'RSVPAuthFailed';
            RSVPAuthCommandHandler.description = ['RSVP Authentication Step Failed'];
            RSVPAuthCommandHandler.parentCommand = 'RSVPAuth';
            RSVPAuthCommandHandler.$q = $q;

            RSVPAuthCommandHandler.handle = function (session, cmd) {
                var outText = [];
                var childHandler = '';

                var fakeHttpCall = function(isSuccessful) {

                  var deferred = $q.defer();

                    if(isSuccessful === "true"){
                        childHandler = 'RSVPEmail';
                        outText.push("Please enter your email.");
                    }
                    else{
                        childHandler = 'RSVPAuthFailed';
                        outText.push("Token not recognized.  Please re-enter the token.");
                    }

                  return deferred.promise;
                };

                fakeHttpCall(cmd).then(
                  function (data) {
                    // success callback
                    session.output.push({ output: true, text: outText, breakLine: true });
                    return cmd;
                  },
                  function (err) {
                    // error callback
                    console.log(err);
                  });

            };

            $commandBrokerProvider.appendChildCommandHandler(RSVPAuthCommandHandler);
        }]);
    };
});