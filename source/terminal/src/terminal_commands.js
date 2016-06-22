(function (global) {
  var TerminalCommands = function (module) {
    global.angular.forEach(TerminalCommands.list,
      function (command) {
        command(module);
    });
  };

  define([
    "./terminal_commands/clear.js",
    "./terminal_commands/help.js",
    "./terminal_commands/location.js",
    "./terminal_commands/registry-redirect.js",
    "./terminal_commands/registry.js",
    "./terminal_commands/rsvp-auth-failed.js",
    "./terminal_commands/rsvp-auth.js",
    "./terminal_commands/rsvp-complete.js",
    "./terminal_commands/rsvp.js"
  ], function (
    clear,
    help,
    location,
    registryRedirect,
    registry,
    rsvpAuthFailed,
    rsvpAuth,
    rsvpComplete,
    rsvp
    ) {
    TerminalCommands.list = arguments;
    return TerminalCommands;
  });
}(window));