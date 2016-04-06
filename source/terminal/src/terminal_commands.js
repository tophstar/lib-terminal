(function (global) {
  var TerminalCommands = function (module) {
    global.angular.forEach(TerminalCommands.list,
      function (command) {
        command(module);
    });
  };

  define([
    "./terminal_commands/help.js",
    "./terminal_commands/location.js",
    "./terminal_commands/rsvp.js",
    "./terminal_commands/rsvp-auth.js",
    "./terminal_commands/rsvp-auth-failed.js",
    "./terminal_commands/rsvp-email.js"
  ], function (
    help,
    location,
    rsvp,
    rsvpAuth,
    rsvpAuthFailed,
    rsvpEmail
    ) {
    TerminalCommands.list = arguments;
    return TerminalCommands;
  });
}(window));