(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $q) {

                var RSVPCompleteCommandHandler = {};

                RSVPCompleteCommandHandler.command = 'RSVPComplete';
                RSVPCompleteCommandHandler.description = ['First time RSVP completed.'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPCompleteCommandHandler.parentCommand = ['RSVPComplete', 'RSVPVegiterian', 'RSVPReceptionAdults'];

                RSVPCompleteCommandHandler.handle = function (session, cmd, scope) {
                    var outText = [];

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');


                    scope.$broadcast('terminal-wait', true);






                    var rsvpAjaxHandler = function(response) {

                        var rsvpResponse = {};

                        if(response.data['status'] === "success"){
                            rsvpResponse =
                                {
                                    'childHandler' : 'RSVPComment',
                                    'outText' : '\n  You have completed the RSVP process.\n\n  Thank You.  \n\n  Please leave a comment, or type in "end" and press enter.'
                                };
                        }
                        else{
                            rsvpResponse =
                            {
                                'childHandler' : '',
                                'outText' : "Something went wrong...."
                            };
                        }

                      return rsvpResponse;
                    };



                    if(cmd === 'help'){
                        var deferred = q.defer();

                        outText.push("If you have any questions leave a comment here in the command prompt.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPComplete');

                        return deferred.promise;
                    }
                    else if(cmd.toLowerCase() === 'exit'){
                        var deferred2 = q.defer();
                        outText.push("You have quit the RSVP before completing.  You will have to start over again.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred2.resolve('');

                        return deferred2.promise;
                    }
                    else if(isNaN(cmd)){
                        var deferred3 = q.defer();

                        outText.push('\n  Please enter a valid number of vegiterians attending the reception.');
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred3.resolve('RSVPComplete');

                        return deferred3.promise;
                    }
                    else{

                        cmd = Number(cmd);

                        var req = {
                         method: 'POST',
                         url: '/rsvp/registerVegiterianCount',
                         headers: {
                            'Content-Type': 'application/json',
                            "x-requested-with": "XMLHttpRequest",
                         },
                         data: {
                            'email': scope.rsvpEmail,
                            'vegiterianCount': cmd,
                            'rsvpComplete' : '1',
                            'accessToken' : scope.rsvpAccessToken,
                            'ttl': scope.rsvpAccessTokenTTL,
                            'created': scope.rsvpAccessTokenCreated
                          }
                        };

                        return http(req).then(
                            function (data) {

                                var rsvpResponse = rsvpAjaxHandler(data);

                                var deferred = q.defer();
                                // success callback
                                outText.push(rsvpResponse['outText']);
                                session.output.push({ output: true, text: outText, breakLine: true });

                                deferred.resolve(rsvpResponse['childHandler']);
                                return deferred.promise;
                            }
                        );
                    }

                };

                $commandBrokerProvider.appendChildCommandHandler(RSVPCompleteCommandHandler);
            }]);
        };
    });
}(window));