(function (global) {
    define([], function () {

    return function (module) {

        module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

            var RSVPAuthCommandHandler = {};

            RSVPAuthCommandHandler.command = 'RSVPAuth';
            RSVPAuthCommandHandler.description = ['RSVP Authentication Step'];
            RSVPAuthCommandHandler.parentCommand = 'rsvp';

            RSVPAuthCommandHandler.handle = function (session, cmd) {

                var injector = global.angular.injector(['ng']),
                    http = injector.get('$http'),
                    q = injector.get('$q');

                var outText = [];
                var childHandler = '';

                var fakeHttpCall = function(isSuccessful) {

                  var deferred = q.defer();

                    if(isSuccessful === "true"){
                        deferred.resolve(
                            {
                                'childHandler' : 'RSVPEmail',
                                'outText':"Please enter your email."
                            }
                        );
                    }
                    else{
                        deferred.resolve(
                        {
                            'childHandler' : 'RSVPAuthFailed',
                            'outText' : "Token not recognized.  Please re-enter the token."
                        });
                    }

                  return deferred.promise;
                };

                return fakeHttpCall(cmd).then(
                  function (data) {
                    var promise = q.defer();
                    // success callback
                    outText.push(data['outText']);
                    session.output.push({ output: true, text: outText, breakLine: true });
                    promise.resolve(data['childHandler']);
                  },
                  function (err) {
                    // error callback
                    console.log(err);
                  });

            };

            $commandBrokerProvider.appendChildCommandHandler(RSVPAuthCommandHandler);
        }]);
    };
});
}(window));