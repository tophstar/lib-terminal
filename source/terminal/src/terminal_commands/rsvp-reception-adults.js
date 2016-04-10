(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $q) {

                var RSVPReceptionAdultsCommandHandler = {};

                RSVPReceptionAdultsCommandHandler.command = 'RSVPReceptionAdults';
                RSVPReceptionAdultsCommandHandler.description = ['RSVP for adults to the reception.'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPReceptionAdultsCommandHandler.parentCommand = ['RSVPReceptionAdults', 'RSVPRecetpion'];

                RSVPReceptionAdultsCommandHandler.handle = function (session, cmd, scope) {
                    var outText = [];

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');


                    scope.$broadcast('terminal-wait', true);

                    var fakeHttpCall = function(isSuccessful) {

                      var deferred = q.defer();


                        //Check email is valid....

                        if(isSuccessful.toLowerCase() === "yes"){
                            deferred.resolve(
                                {
                                    'childHandler' : 'RSVPReceptionChildren',
                                    'outText' : '\n  How many adults (including yourself) are attending the reception?'
                                }
                            );
                        }
                        else if(isSuccessful.toLowerCase() === 'no'){
                            var deferred3 = q.defer();
                            outText.push("Sorry we won't see you there.  Now you're done.  Is there anything you would like to ask us?");
                            session.output.push({ output: true, text: outText, breakLine: true });
                            deferred3.resolve('RSVPComplete');

                            return deferred3.promise;
                        }
                        else if(isSuccessful === "false") {
                            deferred.resolve(
                                {
                                    'childHandler' : 'RSVPCeremonyAdults',
                                    'outText' : '\n  Please enter either yes or no'
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

                        outText.push("Please enter the number of adults attending the reception including yourself.\n\n"+
                            "  If there are no adults please enter 0.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPReceptionAdults');

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

                $commandBrokerProvider.appendChildCommandHandler(RSVPReceptionAdultsCommandHandler);
            }]);
        };
    });
}(window));