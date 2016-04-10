(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $q) {

                var RSVPVegiterianCommandHandler = {};

                RSVPVegiterianCommandHandler.command = 'RSVPVegiterian';
                RSVPVegiterianCommandHandler.description = ['First time RSVP for the ceremony.'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPVegiterianCommandHandler.parentCommand = ['RSVPVegiterian', 'RSVPReceptionChildren'];

                RSVPVegiterianCommandHandler.handle = function (session, cmd, scope) {
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
                                    'childHandler' : 'RSVPComplete',
                                    'outText' : '\n  How many vegiterians are there in your party?'
                                }
                            );
                        }
                        else if(isSuccessful === "false") {
                                deferred.resolve(
                                {
                                    'childHandler' : 'RSVPVegiterian',
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

                        outText.push("We need to know how many people are vegiterians for the catering.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPVegiterian');

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

                $commandBrokerProvider.appendChildCommandHandler(RSVPVegiterianCommandHandler);
            }]);
        };
    });
}(window));