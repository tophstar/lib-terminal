(function () {
	var Controller = function ($scope, $http) {

		$scope.showRSVPEdit = false;

        $scope.rsvp = {
            oldEmail: '',
            email: '',
            name: '',
            attendingCeremony : 0,
            adultsCeremony : 0,
            childrenCeremony: 0,
            attendingReception: 0,
            adultsReception : 0,
            childrenReception : 0,
            vegiterianCount : 0,
            rsvpComplete : 0,
            rsvpComments : ''
        };

		$scope.$on('switchToRSVPEdit', function (event, data) {

			$scope.rsvp = data;
			$scope.rsvp.oldEmail = $scope.rsvp.email;

			$scope.showRSVPEdit = true;
			$scope.showCommandTerminal = false;
		});

		$scope.exitButtonClick = function () {
			$scope.showRSVPEdit = false;
			$scope.showCommandTerminal = true;
		};

		$scope.saveButtonClick = function () {



                    var rsvpAjaxHandler = function(response) {

                      var rsvpResponse = {};

                        if(response.data['status'] === "success"){
                            rsvpResponse=
                                {
                                    'outText' : '\n  Your RSVP was successfully modified.'
                                };
                        }
                        else{
                            rsvpResponse =
                            {
                                'childHandler' : '',
                                'outText' : "Something went wrong...."
                            };
                        }

                      return rsvpResponse;
                    };

					var req = {
                         method: 'POST',
                         url: '/rsvp/rsvpEdit',
                         headers: {
                            'Content-Type': 'application/json',
                            "x-requested-with": "XMLHttpRequest",
                         },
                         data: {
                            'data': $scope.rsvp,
                            'accessToken' : $scope.rsvpAccessToken,
                            'ttl': $scope.rsvpAccessTokenTTL,
                            'created': $scope.rsvpAccessTokenCreated
                          }
                        };

                        $http(req).then(
                            function (data) {

								var outText = [];
                                var rsvpResponse = rsvpAjaxHandler(data);
                                outText.push(rsvpResponse['outText']);
                                $scope.session.output.push({ output: true, text: outText, breakLine: true });

								$scope.showRSVPEdit = false;
								$scope.showCommandTerminal = true;
                            }
                        );

		};
	};

	define(["angular"], function (angular) {
		Controller.angular = angular;
		return Controller;
	});
}());