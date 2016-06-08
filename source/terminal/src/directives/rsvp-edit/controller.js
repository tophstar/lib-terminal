(function () {
	var Controller = function ($scope, $http, $window) {

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

            data.attendingCeremony = data.attendingCeremony === "1" ? 'yes':'no';
            data.attendingReception = data.attendingReception === "1" ? 'yes':'no';

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



            if($scope.rsvp.attendingCeremony.toLowerCase() !== "yes" && $scope.rsvp.attendingCeremony.toLowerCase() !== "no"){
                $window.alert("Please enter \"yes\" or \"no\" to the question \"Are you or anyone in your party attending the ceremony?\"");
                return;
            }

            if($scope.rsvp.attendingReception.toLowerCase() !== "yes" && $scope.rsvp.attendingReception.toLowerCase() !== "no"){
                $window.alert("Please enter \"yes\" or \"no\" to the question \"Are you or anyone in your party attending the reception?\"");
                return;
            }

            $scope.rsvp.attendingCeremony = $scope.rsvp.attendingCeremony === "yes" ? 1:0;
            $scope.rsvp.attendingReception = $scope.rsvp.attendingReception === "yes" ? 1:0;

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