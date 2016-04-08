(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

                var RSVPAuthCommandHandler = {};

                RSVPAuthCommandHandler.command = 'RSVPAuthFailed';
                RSVPAuthCommandHandler.description = ['RSVP Authentication Step Failed'];
                RSVPAuthCommandHandler.parentCommand = ['RSVPAuthFailed', 'RSVPAuth'];

                RSVPAuthCommandHandler.handle = function (session, cmd, scope) {
                    var outText = [];
                    var childHandler = '';

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');

                    scope.$broadcast('terminal-wait', true);

                    var fakeHttpCall = function(isSuccessful) {

                      var deferred = q.defer();

                        if(isSuccessful === "true"){
                            deferred.resolve({
                                'childHandler' : 'RSVPEmail',
                                'outText' : "Please enter your email."
                            });
                        }
                        else{
                            deferred.resolve({
                                'childHandler' : 'RSVPAuthFailed',
                                'outText': "Token not recognized.  Please re-enter the token."
                            });
                        }

                      return deferred.promise;
                    };

                    if(cmd === 'help'){
                        var deferred1 = q.defer();
                        outText.push("Please enter the RSVP code found on your wedding invitation.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred1.resolve('RSVPAuth');

                        return deferred1.promise;
                    }
                    else if(cmd === 'exit'){
                        var deferred2 = q.defer();
                        outText.push("You have exited.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred2.resolve('');

                        return deferred2.promise;
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
                          }
                        );
                    }


                };

                $commandBrokerProvider.appendChildCommandHandler(RSVPAuthCommandHandler);
            }]);
        };
    });
}(window));