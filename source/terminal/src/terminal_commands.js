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
    "./terminal_commands/rsvp-auth-failed.js",
    "./terminal_commands/rsvp-auth.js",
    "./terminal_commands/rsvp-ceremony-adults.js",
    "./terminal_commands/rsvp-ceremony-children.js",
    "./terminal_commands/rsvp-ceremony.js",
    "./terminal_commands/rsvp-comment.js",
    "./terminal_commands/rsvp-complete.js",
    "./terminal_commands/rsvp-email.js",
    "./terminal_commands/rsvp-name.js",
    "./terminal_commands/rsvp-reception-adults.js",
    "./terminal_commands/rsvp-reception-children.js",
    "./terminal_commands/rsvp-reception.js",
    "./terminal_commands/rsvp-revisit",
    "./terminal_commands/rsvp-vegiterian.js",
    "./terminal_commands/rsvp.js"
  ], function (
    help,
    location,
    rsvpAuthFailed,
    rsvpAuth,
    rsvpCeremonyAdults,
    rsvpCeremonyChildren,
    rsvpCeremony,
    rsvpComment,
    rsvpComplete,
    rsvpEmail,
    rsvpCeremonyName,
    rsvpReceptionAdults,
    rsvpReceptionChildren,
    rsvpReception,
    rsvpRevisit,
    rsvpVegiterian,
    rsvp
    ) {
    TerminalCommands.list = arguments;
    return TerminalCommands;
  });
}(window));