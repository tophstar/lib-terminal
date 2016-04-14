(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

                var RSVPCeremonyChildrenCommandHandler = {};

                RSVPCeremonyChildrenCommandHandler.command = 'RSVPCeremonyChildren';
                RSVPCeremonyChildrenCommandHandler.description = ['RSVP Children for the ceremony.'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPCeremonyChildrenCommandHandler.parentCommand = ['RSVPCeremonyChildren', 'RSVPCeremonyAdults'];

                RSVPCeremonyChildrenCommandHandler.handle = function (session, cmd, scope) {
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
                                    'childHandler' : 'RSVPReception',
                                    'outText' : '\n  How many children in your party are attending the ceremony?'
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

                        outText.push("Please enter the number of children attending the ceremony including yourself.\n\n"+
                            "  If there are no children please enter 0.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPCeremonyChildren');

                        return deferred.promise;
                    }
                    else if(cmd.toLowerCase() === 'exit'){
                        var deferred2 = q.defer();
                        outText.push("You have quit the RSVP before completing.   You will have to start over again.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred2.resolve('');

                        return deferred2.promise;
                    }
                    else if(isNaN(cmd)){
                        var deferred3 = q.defer();

                        outText.push('\n  Please enter a valid number of adults attending the ceremony.');
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred3.resolve('RSVPCeremonyChildren');

                        return deferred3.promise;
                    }
                    else{

                        cmd = Number(cmd);

                        var req = {
                         method: 'POST',
                         url: '/rsvp/registerAdultsCeremony',
                         headers: {
                            'Content-Type': 'application/json',
                            "x-requested-with": "XMLHttpRequest",
                         },
                         data: {
                            'email': scope.rsvpEmail,
                            'adultsCeremony': cmd,
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

                $commandBrokerProvider.appendChildCommandHandler(RSVPCeremonyChildrenCommandHandler);
            }]);
        };
    });
}(window));