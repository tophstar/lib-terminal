(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $q) {

                var RSVPNameCommandHandler = {};

                RSVPNameCommandHandler.command = 'RSVPName';
                RSVPNameCommandHandler.description = ['RSVP Name Step'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPNameCommandHandler.parentCommand = ['RSVPName', 'RSVPEmail'];

                RSVPNameCommandHandler.handle = function (session, cmd, scope) {
                    var outText = [];

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');


                    scope.$broadcast('terminal-wait', true);

                    var fakeHttpCall = function(isSuccessful) {

                      var deferred = q.defer();


                        if(isSuccessful === "true"){
                            deferred.resolve(
                                {
                                    'childHandler' : 'RSVPCeremony',
                                    'outText':"\n  Now, please enter your first and last name."
                                }
                            );
                        }
                        else if(isSuccessful === "false"){
                            deferred.resolve(
                            {
                                'childHandler' : 'RSVPName',
                                'outText' : "Emails did not match.  Please try again."
                            });
                        }
                        else {
                            deferred.resolve(
                            {
                                'childHandler' : '',
                                'outText' : "Error."
                            });
                        }

                      return deferred.promise;
                    };



                    if(cmd === 'help'){
                        var deferred = q.defer();

                        outText.push("Please enter your first and last name so we know who is registering.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPName');

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

                $commandBrokerProvider.appendChildCommandHandler(RSVPNameCommandHandler);
            }]);
        };
    });
}(window));