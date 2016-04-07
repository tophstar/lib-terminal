(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

                var RSVPAuthCommandHandler = {};

                RSVPAuthCommandHandler.command = 'RSVPAuth';
                RSVPAuthCommandHandler.description = ['RSVP Authentication Step'];
                RSVPAuthCommandHandler.parentCommand = ['RSVPAuth', 'RSVP'];

                RSVPAuthCommandHandler.handle = function (session, cmd) {

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');

                    var outText = [];
                    var childHandler = '';

                    var fakeHttpCall = function(isSuccessful) {

                      var deferred = q.defer();

                        if(isSuccessful === "true"){
                            deferred.resolve(
                                {
                                    'childHandler' : 'RSVPEmail',
                                    'outText':"Please enter your email."
                                }
                            );
                        }
                        else{
                            deferred.resolve(
                            {
                                'childHandler' : 'RSVPAuthFailed',
                                'outText' : "Token not recognized.  Please re-enter the token."
                            });
                        }

                      return deferred.promise;
                    };


                    if(cmd === 'help'){
                        var deferred = q.defer();
                        outText.push("Please enter the RSVP code found on your wedding invitation.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPAuth');

                        return deferred.promise;
                    }
                    else{
                        return fakeHttpCall(cmd).then(
                          function (data) {
                            var deferred = q.defer();
                            // success callback
                            outText.push(data['outText']);
                            session.output.push({ output: true, text: outText, breakLine: true });
                            deferred.resolve(data['childHandler']);

                            return deferred.promise;
                          },
                          function (err) {
                            // error callback
                            console.log(err);
                          });
                    }



                };

                $commandBrokerProvider.appendChildCommandHandler(RSVPAuthCommandHandler);
            }]);
        };
    });
}(window));