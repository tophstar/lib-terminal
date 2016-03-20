(function () {
  var Controllers = function (module) {
    Controllers.angular.forEach([Controllers.TermCtrl], function (Ctrl) {
      module.controller(Ctrl.NAME, Ctrl);
    });
  };

  define(["angular", "./controllers/term_ctrl"], function (angular, TermCtrl) {
    Controllers.TermCtrl = TermCtrl;
    Controllers.angular = angular;
    return Controllers;
  });
}());