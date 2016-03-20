/* global alert */
(function (global) {
  var device, onSetUpError, angular;
  var TemplateRenderer = function (options) {
    angular = TemplateRenderer.angular;
    device = TemplateRenderer.device;
    onSetUpError = options.getOnSetUpError();

    function setUpError(fallback, message) {
      if (angular.isFunction(onSetUpError)) {
        onSetUpError(fallback, message);
      } else {
        throw new Error(message);
      }
    }

    var terminalTargetSelector = options.getTerminalElementSelector();

    var terminalTarget = TemplateRenderer.document.querySelector(terminalTargetSelector);

    if (terminalTarget) {
      options.setTerminalContainer(terminalTarget);
      var template = TemplateRenderer.getTerminalTemplateMarkup(options);
      angular.element(terminalTarget).html(template);


      // Hide template until angular compiles it to avoid bindings flicker
      var terminal = terminalTarget.querySelector('.terminal');
//      cbtPlayer.style.opacity = 0;

    } else {
      setUpError(false, "No target found. Please set the target property to a valid DOM element selector.");
    }
  };

  function getTerminalTemplateMarkup(options) {
    var template = TemplateRenderer.DESKTOP_TEMPLATE;

    return template;
  }

  define(
      [
          "angular",
          "./template_renderer/terminal_template"
      ],
      function (
          angular,
          TerminalTemplate) {

          TemplateRenderer.DESKTOP_TEMPLATE       = TerminalTemplate;

          TemplateRenderer.angular = angular;
          TemplateRenderer.document = global.document;

          TemplateRenderer.getTerminalTemplateMarkup = getTerminalTemplateMarkup;

          return TemplateRenderer;
      }
  );
}(window));