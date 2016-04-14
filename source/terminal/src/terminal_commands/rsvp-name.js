(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $q) {

                var RSVPNameCommandHandler = {};

                RSVPNameCommandHandler.command = 'RSVPName';
                RSVPNameCommandHandler.description = ['RSVP Name Step'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPNameCommandHandler.parentCommand = ['RSVPName', 'RSVPEmail'];

                RSVPNameCommandHandler.handle = function (session, cmd, scope) {
                    var outText = [];

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');


                    scope.$broadcast('terminal-wait', true);







                    var rsvpAjaxHandler = function(response) {

                      var rsvpResponse = {};

                      if(!response || !response.data){
                        return {'childHandler' : '', 'outText' : 'Error.'};
                      }

                        if(response.data['status'] === "success"){
                            rsvpResponse =
                                {
                                    'childHandler' : 'RSVPCeremony',
                                    'outText':"\n  Now, please enter your first and last name."
                                };
                        }
                        else {
                            rsvpResponse =
                            {
                                'childHandler' : '',
                                'outText' : "Error."
                            };
                        }

                      return rsvpResponse;
                    };



                    if(cmd === 'help'){
                        var deferred = q.defer();

                        outText.push("Please enter your first and last name so we know who is registering.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPName');

                        return deferred.promise;
                    }
                    else if(cmd === 'exit'){
                        var deferred2 = q.defer();
                        outText.push("You have quit the RSVP before completing.   You will have to start over again.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred2.resolve('');

                        return deferred2.promise;
                    }
                    else if(cmd !== scope.rsvpEmail){
                        var deferred3 = q.defer();
                        outText.push("Emails did not match.  Please try again.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred3.resolve('RSVPName');

                        return deferred3.promise;
                    }
                    else{


                        var req = {
                         method: 'POST',
                         url: '/rsvp/registerEmail',
                         headers: {
                            'Content-Type': 'application/json',
                            "x-requested-with": "XMLHttpRequest",
                         },
                         data: {
                            'email': cmd ,
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

                $commandBrokerProvider.appendChildCommandHandler(RSVPNameCommandHandler);
            }]);
        };
    });
}(window));