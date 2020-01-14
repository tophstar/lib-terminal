(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

                var RegistyRedirectCommandHandler = {};

                RegistyRedirectCommandHandler.command = 'MessageMeName';
                RegistyRedirectCommandHandler.description = ['Used to capture the name of the Messanger.'];
                RegistyRedirectCommandHandler.parentCommand = ['MessageMeName', 'MessageMeSubject'];

                RegistyRedirectCommandHandler.handle = function (session, cmd, scope) {
                    var outText = [];
                    var childHandler = '';

                    var injector = global.angular.injector(['ng']),
                        q = injector.get('$q'),
                        $window = injector.get('$window');

                    scope.$broadcast('terminal-wait', true);

                    var fakeHttpCall = function(isSuccessful) {

                      var deferred = q.defer();

                        if(isSuccessful){
                            deferred.resolve({
                                'childHandler' : 'MessageMeMessage',
                                'outText' : "Tell me, what is your name?"
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
                        outText.push("What is your name?  If you don't remember you can probably " +
                            "find it on your Drivers License, or you can always exit.");
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