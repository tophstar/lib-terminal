(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

                var RegistyRedirectCommandHandler = {};

                RegistyRedirectCommandHandler.command = 'RegistyRedirect';
                RegistyRedirectCommandHandler.description = ['Opens a new tab for the website registry'];
                RegistyRedirectCommandHandler.parentCommand = ['RegistyRedirect', 'Registry', 'RSVPComment'];

                RegistyRedirectCommandHandler.handle = function (session, cmd, scope) {
                    var outText = [];
                    var childHandler = '';

                    var injector = global.angular.injector(['ng']),
                        q = injector.get('$q'),
                        $window = injector.get('$window');

                    scope.$broadcast('terminal-wait', true);

                    var fakeHttpCall = function(isSuccessful) {

                      var deferred = q.defer();

                        if(isSuccessful === "yes"){
                            deferred.resolve({
                                'childHandler' : '',
                                'outText' : "Ya all come back and RSVP if you haven't already."
                            });

                            $window.open('https://www.wanderable.com/hm/leslieandchristopher', '_blank');
                        }
                        else{
                            deferred.resolve({
                                'childHandler' : '',
                                'outText': "Error."
                            });
                        }

                      return deferred.promise;
                    };

                    if(cmd === 'help'){
                        var deferred1 = q.defer();
                        outText.push("Please enter the RSVP code found on your wedding invitation.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred1.resolve('RegistyRedirect');

                        return deferred1.promise;
                    }
                    else if(cmd === 'exit'){
                        var deferred2 = q.defer();
                        outText.push("You have exited.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred2.resolve('');

                        return deferred2.promise;
                    }
                    else if(cmd.toLowerCase() !== 'no' && cmd.toLowerCase() !== 'yes'){

                        var deferred4 = q.defer();
                        
                        outText.push('Please enter either yes or no.');
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred4.resolve('RegistyRedirect');

                        return deferred4.promise;
                    }
                    else if(cmd.toLowerCase() === 'no') {
                        var deferred3 = q.defer();
                        outText.push('Here you shall stay.');
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred3.resolve('');

                        return deferred3.promise;
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
                          }
                        );
                    }


                };

                $commandBrokerProvider.appendChildCommandHandler(RegistyRedirectCommandHandler);
            }]);
        };
    });
}(window));
