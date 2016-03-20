(function () {
  define([], function () {
    var template = "" +
      "<div class='terminal' ng-controller='TermCtrl' ng-mouseenter='onMouseEnter()'" +
      " ng-mouseleave='onMouseLeave()'" +
      " ng-click='terminalClick($event)'>" +
      "</div>";
    return template;
  });
}());