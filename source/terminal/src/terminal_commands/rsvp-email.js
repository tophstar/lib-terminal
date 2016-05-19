(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

                var RSVPEmailCommandHandler = {};

                RSVPEmailCommandHandler.command = 'RSVPEmail';
                RSVPEmailCommandHandler.description = ['RSVP Email Step'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPEmailCommandHandler.parentCommand = ['RSVPEmail', 'RSVPAuth', 'RSVPAuthFailed'];

                RSVPEmailCommandHandler.handle = function (session, cmd, scope) {
                    var outText = [];

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');


                    scope.$broadcast('terminal-wait', true);




                    var validateEmail = function (email) {
                        return email.match(/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i);
                    };





                    var rsvpAjaxHandler = function(response) {

                      var rsvpResponse = {};

                      if(!response || !response.data){
                        return {'childHandler' : '', 'outText' : 'Error.'};
                      }


                        if(response.data['status'] === "duplicate_complete"){
                            rsvpResponse =
                                {
                                    'childHandler' : 'RSVPRevisit',
                                    'outText' : "You have already RSVP'd. Would you like to view/edit your RSVP?."
                                };
                        }
                        else if (response.data['status'] === "duplicate") {
                            rsvpResponse =
                            {
                                'childHandler' : 'RSVPCeremony',
                                'outText' : '\n  You have now restarted the RSVP process.\n\n' +
                                '  Please enter you name.'
                            };
                        }
                        else if (response.data['status'] === "success") {
                            rsvpResponse =
                            {
                                'childHandler' : 'RSVPName',
                                'outText' : '\n  You have now begun the RSVP process.\n' +
                                '  You will be able to RSVP all the guest coming with you, ' +
                                'but to begin with I need to ask you a few questions.\n\n' +
                                '  First, please re-enter your email.'
                            };
                        }
/*                        else if(!!response.data['status'] === "continue"){
                            rsvpResponse =
                            {
                                'childHandler' : 'RSVPName',
                                'outText' : '\n  You did not complete your RSVP process the first time through.\n\n' +
                                '  You will have to start again from the begining of the RSVP process.\n' +
                                '  You will be able to RSVP all the guest coming with you, ' +
                                'but to begin with I need to ask you a few questions.\n\n' +
                                '  First, please re-enter your email.'
                            };
                        }
*/                        else {
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

                        outText.push("Please re-enter your email for verification purposes.\n\n  "+
                            "If you don't have an email please use the email fake@fake.com.\n\n  "+
                            "If you do not complete the RSVP process you will need to start from the beginning again.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPEmail');

                        return deferred.promise;
                    }
                    else if(cmd === 'exit'){
                        var deferred2 = q.defer();
                        outText.push("You have quit the RSVP before completing.   You will have to start over again.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred2.resolve('');

                        return deferred2.promise;
                    }
                    else if(!validateEmail(cmd)) {
                        var deferred3 = q.defer();
                        outText.push("Something was wrong with your email.  Try a format of youremail@gmail.com, youremail@hotmail.com, ect.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred3.resolve('RSVPEmail');

                        return deferred3.promise;
                    }
                    else{



                        scope.rsvpEmail = cmd;


                        var req = {
                         method: 'POST',
                         url: '/rsvp/emailRevistCheck',
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

                $commandBrokerProvider.appendChildCommandHandler(RSVPEmailCommandHandler);
            }]);
        };
    });
}(window));