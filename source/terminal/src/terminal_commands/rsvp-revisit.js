(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

                var RSVPRevisitCommandHandler = {};

                RSVPRevisitCommandHandler.command = 'RSVPRevisit';
                RSVPRevisitCommandHandler.description = ['RSVP Email Step'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPRevisitCommandHandler.parentCommand = ['RSVPRevisit', 'RSVPEmail'];

                RSVPRevisitCommandHandler.handle = function (session, cmd, scope) {
                    var outText = [];

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');


                    scope.$broadcast('terminal-wait', true);

                    var fakeHttpCall = function(isSuccessful) {

                      var deferred = q.defer();


                        if(isSuccessful === "true"){

                            //Show view/edit directive



                            scope.$broadcast('switchToRSVPEdit');

                            deferred.resolve(
                                {
                                    'childHandler' : 'This should show the view/edit directive',
                                    'outText' : ""
                                }
                            );
                        }
                        else if (isSuccessful === "false") {
                            deferred.resolve(
                            {
                                'childHandler' : '',
                                'outText' : '\n  You have now begun the RSVP process.\n' +
                                '  You will be able to RSVP all the guest coming with you, ' +
                                'but to begin with I need to ask you a few questions.\n\n' +
                                '  First, please re-enter your email.'
                            });
                        }
                        else {
                            deferred.resolve(
                            {
                                'childHandler' : '',
                                'outText' : 'Error.'
                            });
                        }

                      return deferred.promise;
                    };



                    if(cmd === 'help'){
                        var deferred = q.defer();

                        outText.push("");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPRevisit');

                        return deferred.promise;
                    }
                    else if(cmd === 'exit'){
                        var deferred2 = q.defer();
                        outText.push("");
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

                $commandBrokerProvider.appendChildCommandHandler(RSVPRevisitCommandHandler);
            }]);
        };
    });
}(window));