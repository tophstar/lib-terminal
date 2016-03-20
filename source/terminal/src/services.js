(function () {
  function defaultErrorCallback(message) {
    throw new Error(message);
  }


  var Services = function (module) {
    var angular = Services.angular;

    module.factory("$cbtErrors", ["$cbtOptions", function ($cbtOptions) {
      var onErrorCallback = $cbtOptions.getOnErrorCallback();
      onErrorCallback = (angular.isFunction(onErrorCallback)) ? onErrorCallback : defaultErrorCallback;

      function errorCallback(code, msg) {
        var info = "[Error " + code + "] " + msg;
        onErrorCallback(info, code);
      }

      var self = {

        videoError: function (error) {
          var msg = error;
          if (!angular.isString(error)) {
            msg = error.toString();
          }

          errorCallback(11, "Video Error: " + msg);
        }
      };

      return self;
    }]);
  };

  define(["angular"], function (angular) {
    Services.angular = angular;
    return Services;
  });
}());