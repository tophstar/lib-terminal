(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $q) {

                var RSVPReceptionCommandHandler = {};

                RSVPReceptionCommandHandler.command = 'RSVPReception';
                RSVPReceptionCommandHandler.description = ['First time RSVP for the reception.'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPReceptionCommandHandler.parentCommand = ['RSVPReception', 'RSVPCeremonyChildren'];

                RSVPReceptionCommandHandler.handle = function (session, cmd, scope) {
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
                                    'childHandler' : 'RSVPReceptionAdults',
                                    'outText' : '\n  Are you or anyone in your party attending the Reception after the Wedding Ceremony?\n\n' +
                                        '  The reception be on the same day August 18th at 6:00 pm at the Sweet Cheeks Winery.\n' +
                                        '  The winery is located 15 minutes outside Eugene at:\n' +
                                        '  27007 Briggs Hill Rd,\n  Eugene, OR 97405\n\n' +
                                        '  Please answer yes or no.'
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

                        outText.push("We need to know if you are attending the ceremony and/or the reception.  Please answer with yes or no.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPCeremony');

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

                        outText.push('\n  Please enter a valid number of children attending the ceremony.');
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred3.resolve('RSVPReception');

                        return deferred3.promise;
                    }
                    else{

                        cmd = Number(cmd);

                        var req = {
                         method: 'POST',
                         url: '/rsvp/registerChildrenCeremony',
                         headers: {
                            'Content-Type': 'application/json',
                            "x-requested-with": "XMLHttpRequest",
                         },
                         data: {
                            'email': scope.rsvpEmail,
                            'childrenCeremony': cmd,
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

                $commandBrokerProvider.appendChildCommandHandler(RSVPReceptionCommandHandler);
            }]);
        };
    });
}(window));