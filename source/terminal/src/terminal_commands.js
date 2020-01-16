(function (global) {
  var TerminalCommands = function (module) {
    global.angular.forEach(TerminalCommands.list,
      function (command) {
        command(module);
    });
  };

  define([
    "./terminal_commands/blog/blog.js",
    "./terminal_commands/blog/blog-redirect.js",
    "./terminal_commands/clear.js",
    "./terminal_commands/help.js",
    "./terminal_commands/message-me/message-me-done.js",
    "./terminal_commands/message-me/message-me-message.js",
    "./terminal_commands/message-me/message-me-name.js",
    "./terminal_commands/message-me/message-me-subject.js",
    "./terminal_commands/message-me/message-me.js",
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