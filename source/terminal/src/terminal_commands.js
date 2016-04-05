(function (global) {
  var TerminalCommands = function (module) {
    global.angular.forEach(TerminalCommands.list,
      function (command) {
        command(module);
    });
  };

  define([
    "./terminal_commands/help.js",
//    "./terminal_commands/location.js"
  ], function (
    help,
//    location
    ) {
    TerminalCommands.list = arguments;
    return TerminalCommands;
  });
}(window));