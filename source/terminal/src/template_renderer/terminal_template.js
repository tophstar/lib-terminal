(function () {
  define([], function () {
    var template = "" +
		"<div class='terminal-container' ng-controller='TermCtrl' ng-mouseenter='onMouseEnter()'" +
		" ng-mouseleave='onMouseLeave()'" +
		" ng-click='terminalClick($event)'>" +
			"<terminal-output></terminal-output>" +
		"</div>";
    return template;
  });
}());