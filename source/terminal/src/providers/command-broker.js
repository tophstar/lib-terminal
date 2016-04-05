(function () {
    var CommandBroker = function () {
        var me = {};
        me.handlers = [];
        me.redirectors = [];
        var angular = CommandBroker.angular;

        var selectByRedirectors = function (commandParts) {
            var result = [], r=[];
            for (var i = 0; i < commandParts.length; i++) {
                var cp = commandParts[i];
                var suitableRedirectors;
                //@todo fix this to not use jslint ignore.
                /*jshint ignore:start*/
                suitableRedirectors = me.redirectors.filter(function (r) { return r.command === cp; });
                /*jshint ignore:end*/
                if (suitableRedirectors.length) {
                    result.push(r);
                    result.push(cp);
                    r = [];
                }
                else
                {
                    r.push(cp);
                }
            }
            if (r.length){
                result.push(r);
            }

            return result;
        };

        me.$get = ['$injector', '$commandLineSplitter', function ($injector, $commandLineSplitter) {
            return {
                execute: function (session, consoleInput) {

                    if (!consoleInput){
                        return;
                    }

                    var fullCommandParts = $commandLineSplitter.split(consoleInput);

                    var stackedParts = selectByRedirectors(fullCommandParts);

                    var tempSession = {
                        commands: [],
                        output: []
                    };

                    var redirector = null;

                    for (var i = 0; i < stackedParts.length; i++) {
                        var p = stackedParts[i];
                        var suitableRedirectors;
                        var suitableHandlers;

                        if (redirector) {
                            p.splice(0, 0, tempSession);
                            redirector.handle.apply(redirector, p);
                            redirector = null;
                            continue;
                        }
                        //@todo fix this to not use jslint ignore.
                        /*jshint ignore:start*/
                        suitableRedirectors = me.redirectors.filter(function (r) { return r.command === p; });
                        /*jshint ignore:end*/
                        if (suitableRedirectors.length) {

                            redirector = suitableRedirectors[0];
                            tempSession = {
                                commands: [],
                                output: [],
                                input: tempSession.output
                            };
                        }
                        else {

                            //@todo fix this to not use jslint ignore.
                            /*jshint ignore:start*/
                            suitableHandlers = me.handlers.filter(function (item) {
                                return p.length && item.command === p[0].toLowerCase();
                            });
                            /*jshint ignore:end*/


                            if (suitableHandlers.length === 0){
                                throw new Error("There is no suitable handler for that command.");
                            }

                            var h = suitableHandlers[0];

                            p[0] = tempSession;
                            h.handle.apply(h, p);
                        }
                    }
                    angular.extend(session, tempSession);
                },

                init: function () { // inject dependencies on commands
                    // this method should run in '.config()' time, but also does the command addition,
                    // so run it at '.run()' time makes more sense and ensure all commands are already present.
                    var inject = function (handler) {
                        if (handler.init) {
                            $injector.invoke(handler.init);
                        }
                    };
                    for (var i = 0; i < me.handlers.length; i++) {
                        inject(me.handlers[i]);

                    }
                    for (var j = 0; j < me.redirectors.length; j++) {
                        inject(me.redirectors[i]);
                    }
                }
            };
        }];

        me.appendCommandHandler = function (handler) {
            if (!handler || !handler.command || !handler.handle || !handler.description){
                throw new Error("Invalid command handler");
            }

            var suitableHandlers = me.handlers.filter(function (item) {
                return item.command === handler.command;
            });

            if (suitableHandlers.length !== 0){
                throw new Error("There is already a handler for that command.");
            }

            me.handlers.push(handler);
        };

        me.appendRedirectorHandler = function (handler) {
            if (!handler || !handler.command || !handler.handle){
                throw new Error("Invalid redirect handler");
            }

            var suitableHandlers = me.redirectors.filter(function (item) {
                return item.command === handler.command;
            });

            if (suitableHandlers.length !== 0){
                throw new Error("There is already a handler for that redirection.");
            }

            me.redirectors.push(handler);
        };

        me.describe = function () {
            return me.handlers.map(function (item) { return { command: item.command, description: item.description }; });
        };

        return me;
    };

define(["angular"], function (angular) {
    CommandBroker.NAME = "$commandBroker";
    CommandBroker.angular = angular;
    return CommandBroker;
  });
}());