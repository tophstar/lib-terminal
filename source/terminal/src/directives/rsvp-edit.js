(function () {
    var RSVPEdit = function () {
        return {
            restrict: "E",
            replace: true,
            link: RSVPEdit.Link,
            template: RSVPEdit.Template,
            controller: RSVPEdit.Controller
        };
    };

    define([
        "./rsvp-edit/link",
        "./rsvp-edit/template",
        "./rsvp-edit/controller"
    ], function (Link, Template, Controller) {
        RSVPEdit.Link = Link;
        RSVPEdit.Template = Template;
        RSVPEdit.Controller = Controller;
        RSVPEdit.NAME = "rsvpEdit";
        return RSVPEdit;
    });
}());