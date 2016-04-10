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

                    var fakeHttpCall = function(isSuccessful) {

                      var deferred = q.defer();


                        //Check email is valid....

                        if(isSuccessful === "true"){
                            deferred.resolve(
                                {
                                    'childHandler' : 'RSVPReception',
                                    'outText' : '\n  How many children in your party are attending the ceremony?'
                                }
                            );
                        }
                        else if(isSuccessful === "false") {
                                deferred.resolve(
                                {
                                    'childHandler' : 'RSVPReception',
                                    'outText' : '\n  Please enter a valid number of adults attending the ceremony.'
                                }
                            );
                        }
                        else{
                            deferred.resolve(
                            {
                                'childHandler' : '',
                                'outText' : "Something went wrong...."
                            });
                        }

                      return deferred.promise;
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

                $commandBrokerProvider.appendChildCommandHandler(RSVPCeremonyChildrenCommandHandler);
            }]);
        };
    });
}(window));