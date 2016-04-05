(function () {
    var CommandLineSplitter = function () {
        var me = {};
        var brackets = ['{', '}'];
        brackets.keep = true;
        me.separators = [['"'], ["'"], brackets];

        var isOpener = function (c) {
            var suitableOpeners = me.separators.filter(function (item) { return item[0] === c; });
            if (suitableOpeners.length > 1){
                throw new Error("Opening tag in multiple pairs: " + c);
            }
            else if (suitableOpeners.length === 0){
                return null;
            }
            else {
                return suitableOpeners[0];
            }
        };

        me.split = function (input) {
            var parts = [];
            var part = '';
            var currentOc = null;
            for (var i = 0; i < input.length; i++) {
                var c = input[i];

                if (c === ' ' && !currentOc) {
                    if (part){
                        parts.push(part);
                    }
                    part = '';
                    continue;
                }

                if (currentOc && currentOc[currentOc.length - 1] === c) {
                    if (i !== input.length - 1 && input[i + 1] !== ' '){
                        throw new Error("An closing tag can only appear at the end of a sentence or before a space.");
                    }

                    if (currentOc.keep){
                        part += c;
                    }

                    parts.push(part);
                    part = '';
                    currentOc = null;
                    continue;
                }

                var oc = currentOc ? null : isOpener(c);

                if (oc) {
                    if (i !== 0 && input[i - 1] !== ' '){
                        throw new Error("An opening tag can only appear at the beggining of a sentence or after a space.");
                    }

                    currentOc = oc;
                    if (currentOc.keep){
                        part += c;
                    }
                    continue;
                }

                part += c;

            }
            
            if (part){
                parts.push(part);
            }
            
            return parts;
        };

        me.$get = function () {
            return {
                split: function (input) {
                    var parts = [];
                    var part = '';
                    var currentOc = null;
                    for (var i = 0; i < input.length; i++) {
                        var c = input[i];

                        if (c === ' ' && !currentOc) {
                            if (part){
                                parts.push(part);
                            }
                            part = '';
                            continue;
                        }

                        if (currentOc && currentOc[currentOc.length - 1] === c) {
                            if (i !== input.length - 1 && input[i + 1] !== ' '){
                                throw new Error("An closing tag can only appear at the end of a sentence or before a space.");
                            }

                            if (currentOc.keep){
                                part += c;
                            }

                            parts.push(part);
                            part = '';
                            currentOc = null;
                            continue;
                        }

                        var oc = currentOc ? null : isOpener(c);

                        if (oc) {
                            if (i !== 0 && input[i - 1] !== ' '){
                                throw new Error("An opening tag can only appear at the beggining of a sentence or after a space.");
                            }

                            currentOc = oc;
                            if (currentOc.keep){
                                part += c;
                            }
                            continue;
                        }

                        part += c;

                    }
                    if (part){
                        parts.push(part);
                    }
                    return parts;
                }
            };
        };
        return me;
    };

define([], function () {
    CommandLineSplitter.NAME = "$commandLineSplitter";
    return CommandLineSplitter;
  });
}());