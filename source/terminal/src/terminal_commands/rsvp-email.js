(function (global) {
    define([], function () {

        return function (module) {

            module.config(['$commandBrokerProvider', function ($commandBrokerProvider, $q) {

                var RSVPEmailCommandHandler = {};

                RSVPEmailCommandHandler.command = 'RSVPEmail';
                RSVPEmailCommandHandler.description = ['RSVP Email Step'];



                //@TODO how am I going to implement this?  Maybe there shouldn't be an auth failed and it just returns to RSVPAuth
                RSVPEmailCommandHandler.parentCommand = ['RSVPEmail', 'RSVPAuth', 'RSVPAuthFailed'];

                RSVPEmailCommandHandler.handle = function (session, cmd) {
                    var outText = [];

                    var injector = global.angular.injector(['ng']),
                        http = injector.get('$http'),
                        q = injector.get('$q');


                    var fakeHttpCall = function(isSuccessful) {

                      var deferred = q.defer();


                        if(isSuccessful === "true"){
                            deferred.resolve(
                                {
                                    'childHandler' : 'RSVPRevisit',
                                    'outText':"You have already RSVP'd.  What would you like to do, View or Edit your RSVP. (Type in either the View or Edit command)."
                                }
                            );
                        }
                        else{
                            deferred.resolve(
                            {
                                'childHandler' : 'RSVPBegin',
                                'outText' : "You have now begun the RSVP process.  Please re-enter your email."
                            });
                        }

                      return deferred.promise;
                    };



                    if(cmd === 'help'){
                        var deferred = q.defer();

                        outText.push("Please enter your email.  You will be registered.");
                        session.output.push({ output: true, text: outText, breakLine: true });
                        deferred.resolve('RSVPEmail');

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

                $commandBrokerProvider.appendChildCommandHandler(RSVPEmailCommandHandler);
            }]);
        };
    });
}(window));