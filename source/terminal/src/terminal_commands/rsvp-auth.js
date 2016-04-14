(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

                var RSVPAuthCommandHandler = {};

                RSVPAuthCommandHandler.command = 'RSVPAuth';
                RSVPAuthCommandHandler.description = ['RSVP Authentication Step'];
                RSVPAuthCommandHandler.parentCommand = ['RSVPAuth', 'RSVP'];

                RSVPAuthCommandHandler.handle = function (session, cmd, scope) {

                    scope.$broadcast('terminal-wait', true);

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');

                    var outText = [];
                    var childHandler = '';



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
                                'outText' : "Token not recognized.  Please re-enter the token."
                            };
                        }

                      return rsvpResponse;
                    };







                    if(cmd === 'help'){
                        var deferred = q.defer();
                        outText.push("Please enter the RSVP code found on your wedding invitation.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPAuth');

                        return deferred.promise;
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