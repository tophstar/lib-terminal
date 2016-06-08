(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

                var RSVPCeremonyAdultsCommandHandler = {};

                RSVPCeremonyAdultsCommandHandler.command = 'RSVPCeremonyAdults';
                RSVPCeremonyAdultsCommandHandler.description = ['RSVP for adults to the ceremony.'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPCeremonyAdultsCommandHandler.parentCommand = ['RSVPCeremonyAdults', 'RSVPCeremony'];

                RSVPCeremonyAdultsCommandHandler.handle = function (session, cmd, scope) {
                    var outText = [];

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');


                    scope.$broadcast('terminal-wait', true);






                    var rsvpAjaxHandler = function(response, cmd) {

                      var rsvpResponse = {};

                        if(response.data['status'] === "success"){
                            rsvpResponse=
                                {
                                    'childHandler' : 'RSVPCeremonyChildren',
                                    'outText' : '\n  How many adults (including yourself) in you party are attending the Wedding Ceremony?'
                                };




                            if(cmd.toLowerCase() === '0') {
                                rsvpResponse =
                                {
                                    'outText' : "Sorry we won't see you there, but you're not done."+
                                        "\n  Are you or anyone in your party attending the Reception after the Wedding Ceremony?\n\n" +
                                        '  The reception be on the same day August 18th at 6:00 pm at the Sweet Cheeks Winery.\n' +
                                        '  The winery is located 15 minutes outside Eugene at:\n' +
                                        '  27007 Briggs Hill Rd,\n  Eugene, OR 97405\n\n' +
                                        '  Please answer yes or no.',
                                    'childHandler' : 'RSVPReceptionAdults'
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




                    if(cmd.toLowerCase() === 'help'){
                        var deferred = q.defer();

                        outText.push("Please enter the number of adults attending the ceremony including yourself.\n\n"+
                            "  If there are no adults please enter 0.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPCeremonyAdults');

                        return deferred.promise;
                    }
                    else if(cmd.toLowerCase() === 'exit') {
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
                        deferred4.resolve('RSVPCeremonyAdults');

                        return deferred4.promise;
                    }
                    else{

                        cmd = cmd.toLowerCase() === 'yes' ? '1' : '0';

                        var req = {
                         method: 'POST',
                         url: '/rsvp/attendingCeremony',
                         headers: {
                            'Content-Type': 'application/json',
                            "x-requested-with": "XMLHttpRequest",
                         },
                         data: {
                            'email': scope.rsvpEmail,
                            'attendingCeremony': cmd,
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

                $commandBrokerProvider.appendChildCommandHandler(RSVPCeremonyAdultsCommandHandler);
            }]);
        };
    });
}(window));