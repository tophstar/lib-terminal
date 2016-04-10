(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $q) {

                var RSVPCompleteCommandHandler = {};

                RSVPCompleteCommandHandler.command = 'RSVPComplete';
                RSVPCompleteCommandHandler.description = ['First time RSVP completed.'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPCompleteCommandHandler.parentCommand = ['RSVPComplete', 'RSVPVegiterian', 'RSVPReceptionAdults'];

                RSVPCompleteCommandHandler.handle = function (session, cmd, scope) {
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
                                    'childHandler' : 'RSVPComment',
                                    'outText' : '\n  You have completed the RSVP process.\n\n  Thank You.  \n\n  Is there anything you would like to ask us?'
                                }
                            );
                        }
                        else if(isSuccessful === "false") {
                            deferred.resolve(
                                {
                                    'childHandler' : 'RSVPComplete',
                                    'outText' : '\n  Please enter a valid number of children attending the ceremony.'
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

                        outText.push("If you have any questions leave a comment here in the command prompt.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPComplete');

                        return deferred.promise;
                    }
                    else if(cmd.toLowerCase() === 'exit'){
                        var deferred2 = q.defer();
                        outText.push("You have quit the RSVP before completing.  You will have to start over again.");
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

                $commandBrokerProvider.appendChildCommandHandler(RSVPCompleteCommandHandler);
            }]);
        };
    });
}(window));