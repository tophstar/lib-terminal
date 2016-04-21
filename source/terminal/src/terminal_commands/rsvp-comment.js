(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $q) {

                var RSVPCommentCommandHandler = {};

                RSVPCommentCommandHandler.command = 'RSVPComment';
                RSVPCommentCommandHandler.description = ['First time RSVP comments.'];


                RSVPCommentCommandHandler.parentCommand = ['RSVPComment', 'RSVPComplete'];

                RSVPCommentCommandHandler.handle = function (session, cmd, scope) {
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
                                    'childHandler' : '',
                                    'outText' : '\n  Thank you for your comments.'
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

                        outText.push("Shouldn't get here");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPComment');

                        return deferred.promise;
                    }
                    else{

                        var req = {
                         method: 'POST',
                         url: '/rsvp/rsvpComment',
                         headers: {
                            'Content-Type': 'application/json',
                            "x-requested-with": "XMLHttpRequest",
                         },
                         data: {
                            'email': scope.rsvpEmail,
                            'rsvpComments': cmd,
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

                $commandBrokerProvider.appendChildCommandHandler(RSVPCommentCommandHandler);
            }]);
        };
    });
}(window));