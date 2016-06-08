(function () {
    define([], function () {
        return "" +
			"<div class='rsvp-edit-table' ng-show='showRSVPEdit'>" +
				"<div class='rsvp-edit-row'>" +
					"<div class='rsvp-edit-cell'>" +
						"Email" +
					"</div>" +
					"<div class='rsvp-edit-cell'>" +
						"<input ng-model='rsvp.email'/>" +
					"</div>" +
				"</div>" +


				"<div class='rsvp-edit-row'>" +
					"<div class='rsvp-edit-cell'>" +
						"Name" +
					"</div>" +
					"<div class='rsvp-edit-cell'>" +
						"<input ng-model='rsvp.name'/>" +
					"</div>" +
				"</div>" +

				"<div class='rsvp-edit-row'>" +
					"<div class='rsvp-edit-cell'>" +
						"Are you or anyone in your party attending the ceremony?" +
					"</div>" +
					"<div class='rsvp-edit-cell'>" +
						"<input ng-model='rsvp.attendingCeremony'/>" +
					"</div>" +
				"</div>" +

				"<div class='rsvp-edit-row'>" +
					"<div class='rsvp-edit-cell'>" +
						"How many adults in your party are going to the ceremony? (including yourself)" +
					"</div>" +
					"<div class='rsvp-edit-cell'>" +
						"<input ng-model='rsvp.adultsCeremony'/>" +
					"</div>" +
				"</div>" +

				"<div class='rsvp-edit-row'>" +
					"<div class='rsvp-edit-cell'>" +
						"How many children in your party are going to the ceremony?" +
					"</div>" +
					"<div class='rsvp-edit-cell'>" +
						"<input ng-model='rsvp.childrenCeremony'/>" +
					"</div>" +
				"</div>" +

				"<div class='rsvp-edit-row'>" +
					"<div class='rsvp-edit-cell'>" +
						"Are you or anyone in your party attending the reception?" +
					"</div>" +
					"<div class='rsvp-edit-cell'>" +
						"<input ng-model='rsvp.attendingReception'/>" +
					"</div>" +
				"</div>" +

				"<div class='rsvp-edit-row'>" +
					"<div class='rsvp-edit-cell'>" +
						"How many adults in your party are going to the reception? (including yourself)" +
					"</div>" +
					"<div class='rsvp-edit-cell'>" +
						"<input ng-model='rsvp.adultsReception'/>" +
					"</div>" +
				"</div>" +

				"<div class='rsvp-edit-row'>" +
					"<div class='rsvp-edit-cell'>" +
						"How many children in your party are going to the reception?" +
					"</div>" +
					"<div class='rsvp-edit-cell'>" +
						"<input ng-model='rsvp.childrenReception'/>" +
					"</div>" +
				"</div>" +

				"<div class='rsvp-edit-row'>" +
					"<div class='rsvp-edit-cell'>" +
						"How many vegiterians are there in your party?" +
					"</div>" +
					"<div class='rsvp-edit-cell'>" +
						"<input ng-model='rsvp.vegiterianCount'/>" +
					"</div>" +
				"</div>" +
				"<div class='rsvp-edit-row'>" +
					"<div class='rsvp-edit-cell'>" +
						"Comments you left for us." +
					"</div>" +
					"<div class='rsvp-edit-cell'>" +
						"<input ng-model='rsvp.rsvpComments'/>" +
					"</div>" +
				"</div>" +

				"<div class='rsvp-edit-row'>" +
					"<div class='rsvp-edit-cell'>" +
						"<input type='button' class='exit-button' ng-click='exitButtonClick()' value='exit'>" +
					"</div>" +
					"<div class='rsvp-edit-cell'>" +
						"<input type='button' class='exit-button' ng-click='saveButtonClick()' value='save'>" +
					"</div>" +
				"</div>" +
			"</div>";
    });
}());

