/* global alert */
(function () {
  var Terminal = function (options) {
    var terminalOptions = Terminal.Options(options);
    var boot = Terminal.Boot(terminalOptions);
    return boot.getTerminal();
  };

  define(["./terminal/options", "./terminal/boot"], function (Options, Boot) {
    Terminal.Options = Options;
    Terminal.Boot = Boot;
    return Terminal;
  });
}());
