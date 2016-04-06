(function (global) {
  var Controllers = function (module) {
    global.angular.forEach([Controllers.TermCtrl], function (Ctrl) {
      module.controller(Ctrl.NAME, Ctrl);
    });
  };

  define([
    "./controllers/term_ctrl"],
    function (
      TermCtrl) {
    Controllers.TermCtrl = TermCtrl;
    return Controllers;
  });
}(window));