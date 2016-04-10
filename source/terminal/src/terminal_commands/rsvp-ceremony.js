(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $q) {

                var RSVPCeremonyCommandHandler = {};

                RSVPCeremonyCommandHandler.command = 'RSVPCeremony';
                RSVPCeremonyCommandHandler.description = ['First time RSVP for the ceremony.'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPCeremonyCommandHandler.parentCommand = ['RSVPCeremony', 'RSVPName'];

                RSVPCeremonyCommandHandler.handle = function (session, cmd, scope) {
                    var outText = [];

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');


                    scope.$broadcast('terminal-wait', true);

                    var fakeHttpCall = function(isSuccessful) {

                      var deferred = q.defer();


                        //Check email is valid....

                        if(isSuccessful === "true"){
                            deferred.resolve(
                                {
                                    'childHandler' : 'RSVPCeremonyAdults',
                                    'outText' : '\n  Are you or anyone in your party planning on attending the Wedding Ceremony? \n\n' +
                                        '  The wedding ceremony will be held at 1:00 pm on August 18th at the Eugene Zendo located at: \n' +
                                        '  2190 Garfield St,\n  Eugene, OR 97405 \n\n' +
                                        '  Please answer yes or no.'
                                }
                            );
                        }
                        else if(isSuccessful === 'false'){
                            deferred.resolve(
                            {
                                'childHandler' : 'RSVPCeremony',
                                'outText' : "Please enter a valid name."
                            });
                        }
                        else {
                            deferred.resolve(
                            {
                                'childHandler' : '',
                                'outText' : "error."
                            });
                        }

                      return deferred.promise;
                    };



                    if(cmd === 'help'){
                        var deferred = q.defer();

                        outText.push("We need to know if you are attending the ceremony and/or the reception seperately.  Please answer with yes or no.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPCeremony');

                        return deferred.promise;
                    }
                    else if(cmd === 'exit'){
                        var deferred2 = q.defer();
                        outText.push("You have quit the RSVP before completing.   You will have to start over again.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred2.resolve('');

                        return deferred2.promise;
                    }
                    else{

                        return fakeHttpCall(cmd).then(
                            function (data) {
                                var deferred = q.defer();
                                // success callback
                                outText.push(data['outText']);
                                session.output.push({ output: true, text: outText, breakLine: true });
                                deferred.resolve(data['childHandler']);

                            return deferred.promise;
                        },
                        function (err) {
                            // error callback
                            console.log(err);
                        });
                    }

                };

                $commandBrokerProvider.appendChildCommandHandler(RSVPCeremonyCommandHandler);
            }]);
        };
    });
}(window));