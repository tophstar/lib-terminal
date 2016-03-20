(function (global) {
  var Options = function (opts) {
    var playerContainer,
        angular = Options.angular;

    function isBoolean(ref) {
      return ref === true || ref === false;
    }

    var self = {
      getTerminalElementSelector: function getPElementSelector() {
        return opts.target;
      },

      getOnErrorCallback: function getOnErrorCallback() {
        return opts.onError || null;
      },

      setOnError: function setOnError(onError) {
        if (angular.isFunction(onError)) {
          opts.onError = onError;
        }
      },

      getOnSetUpError: function getOnSetUpError() {
        return opts.onSetUpError || null;
      },

      setOnSetUpError: function setOnSetUpError(onSetUpError) {
        if (angular.isFunction(onSetUpError)) {
          opts.onSetUpError = onSetUpError;
        }
      },

      setTerminalContainer: function setTerminalContainer(container) {
        playerContainer = container;
      },

      getTerminalContainer: function getTerminalContainer() {
        return playerContainer;
      },

      toString: function toString() {
        return "[object Options]";
      }
    };

    return self;
  };

  define(["angular"], function (angular) {
    Options.angular = angular;
    return Options;
  });
}(window));
