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




                    var rsvpAjaxHandler = function(response) {

                      var rsvpResponse = {};

                        if(!response || !response.data) {
                            return {'childHandler' : '', 'outText' : "Error."};
                        }

                        if(!!response.data['accessToken'] && !!response.data['ttl'] && !!response.data['created']){
                            scope.rsvpAccessToken = response.data['accessToken'];
                            scope.rsvpAccessTokenTTL = response.data['ttl'];
                            scope.rsvpAccessTokenCreated = response.data['created'];

                            rsvpResponse =
                                {
                                    'childHandler' : 'RSVPEmail',
                                    'outText':"Please enter your email."
                                };
                        }
                        else{
                            rsvpResponse =
                            {
                                'childHandler' : 'RSVPAuthFailed',
                                'outText' : "Password not recognized.  Please re-enter the password."
                            };
                        }

                      return rsvpResponse;
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

                        var req = {
                         method: 'POST',
                         url: '/rsvp/getAccessToken',
                         headers: {
                            'Content-Type': 'application/json',
                            "x-requested-with": "XMLHttpRequest",
                         },
                         data: { token: cmd }
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

                $commandBrokerProvider.appendChildCommandHandler(RSVPAuthCommandHandler);
            }]);
        };
    });
}(window));