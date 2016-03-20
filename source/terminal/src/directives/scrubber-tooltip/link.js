(function (global) {
    var Link = function (scope, element) {
    };

    define(["angular"],
        function (angular) {
        Link.angular = angular;
        Link.document = global.document;
        return Link;
    });
}(window));