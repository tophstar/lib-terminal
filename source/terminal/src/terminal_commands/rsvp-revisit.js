(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

                var RSVPRevisitCommandHandler = {};

                RSVPRevisitCommandHandler.command = 'RSVPRevisit';
                RSVPRevisitCommandHandler.description = ['RSVP Email Step'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPRevisitCommandHandler.parentCommand = ['RSVPRevisit', 'RSVPEmail'];

                RSVPRevisitCommandHandler.handle = function (session, cmd, scope) {
                    var outText = [];

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');


                    scope.$broadcast('terminal-wait', true);

                    var rsvpAjaxHandler = function(response) {

                      var rsvpResponse = {};
                        if(!!response.data && response.status === 200){

                            //Show view/edit directive
                            scope.$broadcast('switchToRSVPEdit', response.data);

                            rsvpResponse =
                                {
                                    'childHandler' : 'You just saw the edit screen.',
                                    'outText' : ""
                                };
                        }
                        else {
                            rsvpResponse =
                            {
                                'childHandler' : '',
                                'outText' : 'Error.'
                            };
                        }

                      return rsvpResponse;
                    };



                    if(cmd === 'help'){
                        var deferred = q.defer();

                        outText.push("");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPRevisit');

                        return deferred.promise;
                    }
                    else if(cmd === 'exit'){
                        var deferred2 = q.defer();
                        outText.push("");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred2.resolve('');

                        return deferred2.promise;
                    }
                    else if(cmd.toLowerCase() !== 'no' && cmd.toLowerCase() !== 'yes'){

                        var deferred4 = q.defer();
                        
                        outText.push('Please enter either yes or no.');
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred4.resolve('RSVPRevisit');

                        return deferred4.promise;
                    }
                    else if(cmd.toLowerCase() === 'no') {
                        var deferred3 = q.defer();
                        outText.push('Thank You.');
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred3.resolve('');

                        return deferred3.promise;
                    }
                    else{



                        var req = {
                         method: 'POST',
                         url: '/rsvp/getRsvp',
                         headers: {
                            'Content-Type': 'application/json',
                            "x-requested-with": "XMLHttpRequest",
                         },
                         data: {
                            'email': scope.rsvpEmail,
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

                $commandBrokerProvider.appendChildCommandHandler(RSVPRevisitCommandHandler);
            }]);
        };
    });
}(window));