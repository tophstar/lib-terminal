(function (global) {
    define([], function () {
        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

                var RegistyRedirectCommandHandler = {};

                RegistyRedirectCommandHandler.command = 'MessageMeSubject';
                RegistyRedirectCommandHandler.description = ['Asks for the subject of the message.'];
                RegistyRedirectCommandHandler.parentCommand = ['MessageMeSubject', 'Messanger'];

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
                                'childHandler' : 'MessageMeName',
                                'outText' : "What is the subject of your message?"
                            });

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
                        outText.push("Type in yes, no, or exit.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred1.resolve('MessageMeSubject');

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
                        deferred4.resolve('MessageMeSubject');

                        return deferred4.promise;
                    }
                    else if(cmd.toLowerCase() === 'no') {
                        var deferred3 = q.defer();
                        outText.push('Until next time. May the force be with you.');
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