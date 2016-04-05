(function () {
    var TerminalOutput = function () {
        return {
            restrict: "E",
            replace: true,
            link: TerminalOutput.Link,
            template: TerminalOutput.Template,
            controller: TerminalOutput.Controller
        };
    };

    define([
        "./terminal-output/link",
        "./terminal-output/template",
        "./terminal-output/controller"
    ], function (Link, Template, Controller) {
        TerminalOutput.Link = Link;
        TerminalOutput.Template = Template;
        TerminalOutput.Controller = Controller;
        TerminalOutput.NAME = "terminalOutput";
        return TerminalOutput;
    });
}());