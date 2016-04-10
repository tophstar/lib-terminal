(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $q) {

                var RSVPCommentCommandHandler = {};

                RSVPCommentCommandHandler.command = 'RSVPComment';
                RSVPCommentCommandHandler.description = ['First time RSVP comments.'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPCommentCommandHandler.parentCommand = ['RSVPComment', 'RSVPComplete'];

                RSVPCommentCommandHandler.handle = function (session, cmd, scope) {
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
                                    'childHandler' : '',
                                    'outText' : '\n  Thank you for your comments.'
                                }
                            );
                        }
                        else if(isSuccessful === "false") {
                            deferred.resolve(
                                {
                                    'childHandler' : '',
                                    'outText' : ''
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

                        outText.push("Shouldn't get here");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPComment');

                        return deferred.promise;
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

                $commandBrokerProvider.appendChildCommandHandler(RSVPCommentCommandHandler);
            }]);
        };
    });
}(window));