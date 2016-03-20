(function () {
  var Boot = function (options) {
    var terminal = Boot.Terminal(options);
    var self = {
      getTerminal: function getTerminal() {
        return terminal;
      },

      toString: function toString() {
        return "[object Boot]";
      }
    };

    return self;
  };

  define(["./terminal_boot"], function (terminal) {
    Boot.Terminal = terminal;
    return Boot;
  });
}());
