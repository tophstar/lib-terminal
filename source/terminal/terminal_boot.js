(function (global) {
  var Terminal = function (options) {
    var angular = Terminal.angular;

    Terminal.TemplateRenderer(options);

    var module = angular.module(Terminal.MODULE, Terminal.MODULE_DEPENDENCIES);
    module.constant("$terminalOptions", options);

    module.config([
      '$provide', function($provide) {
        return $provide.decorator('$rootScope', [
          '$delegate', function($delegate) {
            $delegate.safeApply = function (fn) {
              var phase = $delegate.$$phase;
              if (phase === "$apply" || phase === "$digest") {
                if (fn && typeof fn === 'function') {
                  fn();
                }
              } else {
                $delegate.$apply(fn);
              }
            };
            return $delegate;
          }
        ]);
      }
    ]);


    var DEBUG;
    try {
      DEBUG = (window && window.location && window.location.href &&
        (window.location.href.indexOf("http://localhost") > -1 ||
         window.location.href.indexOf("http://10.0.0") > -1)
        );
    } catch (e) {
      DEBUG = false;
    }
    module.provider("$exceptionHandler", function () {
      return {
        $get: function () {
          return function (exception, cause) {
            try {
              if (DEBUG && typeof console !== "undefined") {
                if (console && console.log) {
                  console.log("[ERROR: angular.$exceptionHandler()]");
                  console.log("exception: ", exception);
                  console.log("exception.message: " + exception.message);
                  console.log("exception.stack: " + exception.stack);
                  console.log("cause: " + cause);
                  console.log("[ERROR: END]");
                }
              }
            } catch (e) {
              DEBUG = false;
            }
          };
        }
      };
    });

    /* jshint ignore:start */
    (function() {
      if (!Event.prototype.preventDefault) {
        Event.prototype.preventDefault=function() {
          this.returnValue=false;
        };
      }
      if (!Event.prototype.stopPropagation) {
        Event.prototype.stopPropagation=function() {
          this.cancelBubble=true;
        };
      }
      if (!Element.prototype.addEventListener) {
        var eventListeners=[];

        var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
          var self=this;
          var wrapper=function(e) {
            e.target=e.srcElement;
            e.currentTarget=self;
            if (listener.handleEvent) {
              listener.handleEvent(e);
            } else {
              listener.call(self,e);
            }
          };
          if (type=="DOMContentLoaded") {
            var wrapper2=function(e) {
              if (document.readyState=="complete") {
                wrapper(e);
              }
            };
            document.attachEvent("onreadystatechange",wrapper2);
            eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});

            if (document.readyState=="complete") {
              var e=new Event();
              e.srcElement=window;
              wrapper2(e);
            }
          } else {
            this.attachEvent("on"+type,wrapper);
            eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
          }
        };
        var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
          var counter=0;
          while (counter<eventListeners.length) {
            var eventListener=eventListeners[counter];
            if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
              if (type=="DOMContentLoaded") {
                this.detachEvent("onreadystatechange",eventListener.wrapper);
              } else {
                this.detachEvent("on"+type,eventListener.wrapper);
              }
              break;
            }
            ++counter;
          }
        };
        Element.prototype.addEventListener=addEventListener;
        Element.prototype.removeEventListener=removeEventListener;
        if (HTMLDocument) {
          HTMLDocument.prototype.addEventListener=addEventListener;
          HTMLDocument.prototype.removeEventListener=removeEventListener;
        }
        if (Window) {
          Window.prototype.addEventListener=addEventListener;
          Window.prototype.removeEventListener=removeEventListener;
        }
      }
    }());
    /* jshint ignore:end */

    if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0) ? Math.ceil(from) : Math.floor(from);
        if (from < 0) {
          from += len;
        }

        for (; from < len; from++) {
          if (from in this && this[from] === elt) {
            return from;
          }
        }

        return -1;
      };
    }


    Terminal.Values(module);
    Terminal.Services(module);
    Terminal.Filters(module);
    Terminal.Controllers(module);
    Terminal.Directives(module);

    var element = Terminal.document.querySelector(options.getTerminalElementSelector());
    var target = angular.element(element);
    angular.bootstrap(target, [Terminal.MODULE]);

    // Reveal player after compiling to avoid bindings flicker
    var terminal = target[0].querySelector('.terminal');
    terminal.style.opacity = 1;

    var terminalElement = target[0].querySelector(".terminal");
    var terminalCtrl = angular.element(terminalElement).controller();
    return terminalCtrl.terminalApi();
  };

  define(
    [
      "angular",
      "./src/template_renderer",
      "./src/controllers",
      "./src/directives",
      "./src/services",
      "./src/values",
      "./src/filters"
    ],

    function (angular,
              TemplateRenderer,
              Controllers,
              Directives,
              Services,
              Values,
              Filters) {
      Terminal.MODULE = "terminal";

      Terminal.document = global.document;
      Terminal.angular = angular;
      Terminal.TemplateRenderer = TemplateRenderer;
      Terminal.Controllers = Controllers;
      Terminal.Directives = Directives;
      Terminal.Services = Services;
      Terminal.Values = Values;
      Terminal.Filters = Filters;
      return Terminal;
    }
  );
}(window));
