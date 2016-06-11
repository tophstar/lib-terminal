(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $q) {

                var RSVPReceptionAdultsCommandHandler = {};

                RSVPReceptionAdultsCommandHandler.command = 'RSVPReceptionAdults';
                RSVPReceptionAdultsCommandHandler.description = ['RSVP for adults to the reception.'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPReceptionAdultsCommandHandler.parentCommand = ['RSVPReceptionAdults', 'RSVPRecetpion'];

                RSVPReceptionAdultsCommandHandler.handle = function (session, cmd, scope) {
                    var outText = [];

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');


                    scope.$broadcast('terminal-wait', true);

                    var rsvpAjaxHandler = function(response, cmd) {

                        var rsvpResponse = {};

                        if(response.data['status'] === "success"){
                            rsvpResponse =
                                {
                                    'childHandler' : 'RSVPReceptionChildren',
                                    'outText' : '\n  How many adults (including yourself) are attending the reception?'
                                };



                            if(cmd.toLowerCase() === '0') {
                                rsvpResponse =
                                {
                                    'outText' : "Sorry we won't see you there.  Now you're done. \n\n  Please leave a comment, or type in \"end\" and press enter.",
                                    'childHandler' : 'RSVPComment'
                                };
                            }
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

                        outText.push("Please enter the number of adults attending the reception including yourself.\n\n"+
                            "  If there are no adults please enter 0.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPReceptionAdults');

                        return deferred.promise;
                    }
                    else if(cmd.toLowerCase() === 'exit'){
                        var deferred2 = q.defer();
                        outText.push("You have quit the RSVP before completing.   You will have to start over again.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred2.resolve('');

                        return deferred2.promise;
                    }
                    else if(cmd.toLowerCase() !== 'no' && cmd.toLowerCase() !== 'yes'){

                        var deferred4 = q.defer();
                        
                        outText.push('Please enter either yes or no.');
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred4.resolve('RSVPReceptionAdults');

                        return deferred4.promise;
                    }
                    else{

                        cmd = cmd.toLowerCase() === 'yes' ? '1' : '0';

                        var req = {
                         method: 'POST',
                         url: '/rsvp/attendingReception',
                         headers: {
                            'Content-Type': 'application/json',
                            "x-requested-with": "XMLHttpRequest",
                         },
                         data: {
                            'email': scope.rsvpEmail,
                            'attendingReception': cmd,
                            'accessToken' : scope.rsvpAccessToken,
                            'ttl': scope.rsvpAccessTokenTTL,
                            'created': scope.rsvpAccessTokenCreated
                          }
                        };

                        return http(req).then(
                            function (data) {

                                var rsvpResponse = rsvpAjaxHandler(data, cmd);

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

                $commandBrokerProvider.appendChildCommandHandler(RSVPReceptionAdultsCommandHandler);
            }]);
        };
    });
}(window));