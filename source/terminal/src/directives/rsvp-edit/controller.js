(function () {
	var Controller = function ($scope) {

		$scope.showRSVPEdit = false;

		$scope.$on('switchToRSVPEdit', function (event, val) {
			$scope.showRSVPEdit = true;
			$scope.showCommandTerminal = false;
		});

		$scope.exitButtonClick = function () {
			$scope.showRSVPEdit = false;
			$scope.showCommandTerminal = true;
		};
	};

	define(["angular"], function (angular) {
		Controller.angular = angular;
		return Controller;
	});
}());