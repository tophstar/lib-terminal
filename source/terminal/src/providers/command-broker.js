(function () {
    var CommandBroker = function () {
        var me = {};
        me.handlers = [];
        me.childHandlers = [];
        me.childHandlersStack = [];
        var angular = CommandBroker.angular;

        var gatherCommandParts = function (commandParts) {
            var result = [], r=[];
            for (var i = 0; i < commandParts.length; i++) {
                var cp = commandParts[i];
                r.push(cp);
             }
            result.push(r);

            return result;
        };
        me.$get = ['$injector', '$commandLineSplitter', function ($injector, $commandLineSplitter) {
            return {
                execute: function (session, consoleInput, scope) {
                    try{

                    // NO-OP, no command was given
                    if (!consoleInput){
                        return;
                    }

                    // Get the command and any arguments passed in with that command into one element
                    // var fullCommandParts = gatherCommandParts($commandLineSplitter.split(consoleInput));
                    var fullCommandParts = $commandLineSplitter.split(consoleInput);

                    var tempSession = {
                        commands: [],
                        output: []
                    };

                        var handlerArgs = [];
                        var suitableHandlers= [];

                            // Deal with stacked commands
                            if(me.childHandlersStack.length) {
                                suitableHandlers = me.childHandlersStack.pop();
                            }
                            else{
                                suitableHandlers = me.handlers.filter(function (item) {
                                    return fullCommandParts[0].length && item.command.toLowerCase() === fullCommandParts[0].toLowerCase();
                                });
                            }

                            if (suitableHandlers.length === 0){
                                throw new Error("I can't let you do that.  If you need help type in \"help\".");
                            }

                            handlerArgs[0] = tempSession;
                            handlerArgs[1] = fullCommandParts[0];
                            handlerArgs[2] = scope;
                            // command line arguments not yet supported
                            handlerArgs[3] = fullCommandParts.splice(1);


                            //This is where the command "handle(session, cmd)" is called.
                            var asyncCommand =  suitableHandlers[0].handle.apply(suitableHandlers, handlerArgs);

                            if(asyncCommand){
                                // this is now an async process as child command will sometimes not
                                // execute until an ajax call has completed.
                                asyncCommand.then(function (data) {
                                    scope.$broadcast('terminal-wait', false);
                                    var childHandler = me.childHandlers.filter(function (item) {
                                        return item.command.toLowerCase() === data.toLowerCase();
                                    });

                                    if(childHandler.length){
                                        me.childHandlersStack.push(childHandler);
                                    }

                                    angular.extend(session, tempSession);

                                    scope.safeApply();
                                });
                            }
                            else
                            {

                                // Search for a child handler.  This may only work if the
                                // "parent command" has only one possible child.
                                var childHandler = me.childHandlers.filter(function (item) {
                                    return handlerArgs.length && item.parentCommand.filter(function (cm) {
                                            return cm.toLowerCase() === handlerArgs[1].toLowerCase();
                                        }).length > 0;
                                });

                                if(childHandler.length){
                                    me.childHandlersStack.push(childHandler);
                                }

                                angular.extend(session, tempSession);
                            }
                        } catch (e) {
                            throw new Error('I have broken.');
                        }
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

        me.describe = function () {
            return me.handlers.map(function (item) { return { command: item.command, description: item.description }; });
        };

        me.appendChildCommandHandler = function (handler) {
            if (!handler || !handler.command || !handler.handle || !handler.description || !handler.parentCommand){
                throw new Error("Invalid command handler");
            }

            var suitableHandlers = me.handlers.filter(function (item) {
                return item.command === handler.command;
            });

            if (suitableHandlers.length !== 0){
                throw new Error("There is already a handler for that command.");
            }

            me.childHandlers.push(handler);
        };

        return me;
    };

define(["angular"], function (angular) {
    CommandBroker.NAME = "$commandBroker";
    CommandBroker.angular = angular;
    return CommandBroker;
  });
}());