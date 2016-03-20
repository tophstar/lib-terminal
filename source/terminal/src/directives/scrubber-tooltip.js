(function () {
    var ScrubberTooltip = function () {
        return {
            restrict: "E",
            replace: true,
            link: ScrubberTooltip.Link,
            template: ScrubberTooltip.Template
        };
    };

    define([
        "./scrubber-tooltip/link",
        "./scrubber-tooltip/template"
    ], function (Link, Template) {
        ScrubberTooltip.Link = Link;
        ScrubberTooltip.Template = Template;
        ScrubberTooltip.NAME = "scrubberTooltip";
        return ScrubberTooltip;
    });
}());