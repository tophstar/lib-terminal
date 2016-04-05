define([], function () {

	return function (module) {

		module.config(['$commandBrokerProvider', function ($commandBrokerProvider) {

			var HelpCommandHandler = {};

			HelpCommandHandler.command = 'help';
			HelpCommandHandler.description = ['Provides instructions about how to use this terminal'];

			HelpCommandHandler.handle = function (session, cmd) {
				var list = $commandBrokerProvider.describe();
				var outText = [];
				if (cmd) {
					for (var i = 0; i < list.length; i++) {
						if (list[i].command === cmd) {
							var l = list[i];
							outText.push("Command help for: " + cmd);
							for (var j = 0; j < l.description.length; j++) {
								outText.push(l.description[j]);
							}
							break;
						}
					}

					if(!outText.length){
						outText.push("There is no command help for: " + cmd);
					}
				}
				else {
					outText.push("Available commands:");
					for (var k = 0; k < list.length; k++) {
						var str = "  " + list[k].command + "\t\t";
						for (var m = 0; m < 3 && k + 1 < list.length; m++) {
							var cmdd = list[++k].command;
							str += cmdd + (cmdd.length > 6 ? "\t" : "\t\t");
						}
					outText.push(str);
					}
					outText.push("");
					outText.push("Enter 'help <command>' to get help for a particular command.");
				}
				
				session.output.push({ output: true, text: outText, breakLine: true });
			};

			$commandBrokerProvider.appendCommandHandler(HelpCommandHandler);
		}]);
	};
});