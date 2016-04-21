(function (global) {
    var Link = function (scope, element, attrs) {

		var angular = Link.angular,
			$document = Link.document;

		var terminal = element;
        var target = angular.element(element[0].querySelector('.terminal-target'));
        var consoleView = angular.element(element[0].querySelector('.terminal-viewport'));
        var results = angular.element(element[0].querySelector('.terminal-results'));
        var prompt = angular.element(element[0].querySelector('.terminal-prompt'));
        var cursor = angular.element(element[0].querySelector('.terminal-cursor'));
        var consoleInput = angular.element(element[0].querySelector('.terminal-input'));

        if(navigator.appVersion.indexOf("Trident") !== -1){
            terminal.addClass('damn-ie');
        }

        var css = attrs['terminalClass'];
        if (css) {
            terminal.addClass(css);
        }

        //@todo investigate if this needs to be done in the controller...
        //var config = attrs['terminalConfig'];
        //scope.init(config || 'default');
                                            
        setInterval(function () {
            var focused = $document.activeElement === target[0];
            if (focused) {
                cursor.toggleClass('terminal-cursor-hidden');
            }
            else if (!target.hasClass('terminal-cursor-hidden')){
                cursor.addClass('terminal-cursor-hidden');
            }
        }, 500);

        var mouseover = false;
        element.on('mouseover', function () {
            mouseover = true;
        });
        element.on('mouseleave', function () {
            mouseover = false;
        });

        consoleView.on('click', function () {
            target[0].focus();
            terminal.toggleClass('terminal-focused', true);
        });

        target.on("blur", function (e) {
            if(!mouseover){
                terminal.toggleClass('terminal-focused', false);
            }
        });

        target.on("keypress", function (e) {
            if(scope.showPrompt || scope.allowTypingWriteDisplaying){
                scope.keypress(e.which);
            }
            e.preventDefault();
        });

        target.on("keydown", function (e) {

            if (e.keyCode === 9) {
                e.preventDefault();
            }
            if (e.keyCode === 8) {
                if (scope.showPrompt || scope.allowTypingWriteDisplaying){
                    scope.backspace();
                }
                e.preventDefault();
            }
            else if (e.keyCode === 13) {
                if (scope.showPrompt || scope.allowTypingWriteDisplaying){
                    scope.execute();
                }
            }
            else if (e.keyCode === 38) {
                if (scope.showPrompt || scope.allowTypingWriteDisplaying){
                    scope.previousCommand();
                }
                e.preventDefault();
            }
            else if (e.keyCode === 40) {
                if (scope.showPrompt || scope.allowTypingWriteDisplaying){
                    scope.nextCommand();
                }
                e.preventDefault();
            }
        });

        function type(input, line, i, endCallback) {
            setTimeout(function () {
                scope.typeSound();
                input.textContent += (i<line.length?line[i]:'');

                if (i < line.length - 1) {
                    scope.typeSound();
                    type(input, line, i + 1, endCallback);
                }
                else if (endCallback){
                    endCallback();
                }
            }, scope.outputDelay);
        }

        scope.$watchCollection(function () { return scope.results; }, function (newValues, oldValues) {

			if(newValues === oldValues) {
				return;
			}

            if (oldValues.length && !newValues.length) { // removal detected
                var children = results.children();
                for (var i = 0; i < children.length; i++) {
                    children[i].remove();
                }
            }

            scope.showPrompt = false;
            scope.safeApply();
            var f = [function () {
                scope.showPrompt = true;
                scope.safeApply();
                consoleView[0].scrollTop = consoleView[0].scrollHeight;
            }];

            for (var j = 0; j < newValues.length; j++) {

                var newValue = newValues[j];
                if (newValue.displayed){
                    continue;
                }

                newValue.displayed = true;

                if (scope.outputDelay) {

                    for (var k = newValue.text.length - 1; k >= 0; k--) {
                        var line = document.createElement('pre');
                        line.className = 'terminal-line';

                        var textLine = newValue.text[k];

                        if (scope.outputDelay && newValue.output) {
                            line.textContent = '  ';
                            var fi = f.length - 1;
							//@todo fix this to not use jslint ignore.
							/*jshint ignore:start*/
                            var wrapper = function () {
                                var wline = line;
                                var wtextLine = textLine;
                                var wf = f[fi];
                                var wbreak = k === newValue.text.length - 1 && newValue.breakLine;
                                f.push(function () {
                                    results[0].appendChild(wline); type(wline, wtextLine, 0, wf);
                                    consoleView[0].scrollTop = consoleView[0].scrollHeight;
                                    if (wbreak) {
                                        var breakLine = document.createElement('br');
                                        results[0].appendChild(breakLine);
                                    }
                                });
                            }();
							/*jshint ignore:end*/
                        }
                        else {
                            line.textContent = textLine;
                            results[0].appendChild(line);
                        }
                    }
                }
                else {
                    for (var m = 0; m < newValue.text.length; m++) {
                        var line1 = document.createElement('pre');
                        line1.textContent = newValue.output?'  ':'';
                        line1.className = 'terminal-line';
                        line1.textContent += newValue.text[m];

                        if(!scope.introComplete){
                            line1.className += ' intro-line';
                        }

                        results[0].appendChild(line1);
                    }
                    if (!!newValue.breakLine) {
                        var breakLine = document.createElement('br');
                        results[0].appendChild(breakLine);
                    }
                }
    
            }
            f[f.length - 1]();
        });



    };

    define(["angular"],
        function (angular) {
        Link.angular = angular;
        Link.document = global.document;
        return Link;
    });
}(window));