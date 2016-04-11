(function () {
    define([], function () {
        return "" +
			"<section class='terminal' ng-paste='handlePaste($event)' ng-show='showCommandTerminal'>" +
				"<div class='terminal-viewport'>" +
					"<div class='terminal-results'></div>" +
					"<span class='terminal-prompt' ng-show='showPrompt'>{{prompt.text}}</span>" +
					"<span class='terminal-input'>{{commandLine}}</span>" +
					"<span class='terminal-cursor'>_</span>" +
					"<input type='text' ng-model='commandLine' class='terminal-target'/>" +
				"</div>" +
			"</section>";
    });
}());

