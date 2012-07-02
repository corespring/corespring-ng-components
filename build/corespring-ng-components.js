
/*
----------------------------------------------------------
Corespring Angular components (corespring-ng-components)
@link https://github.com/thesib/corespring-ng-components
----------------------------------------------------------
*/

(function() {



}).call(this);
(function() {

  angular.module('cs.directives', []);

  angular.module('cs', ['cs.directives']).value('cs.config', {});

}).call(this);

/*
aceEditor directive usage:
<div ace-editor
 ace-model="myText"
 ace-resize-trigger="some"
 ace-theme="sometheme"
 ace-mode="mode"></div>
dependencies:
ace.js + whatever theme and mode you wish to use
@param ace-model - a ng model that contains the text to display in the editor. When the code is changed in
the editor this model will be updated.
@param ace-resize-trigger - a property that requires the editor to resize itself
@param ace-theme - an ace theme - loads them using "ace/theme/" + the them you specify. (you need to include the js for it)
@param ace-mode - an ace mode - as above loads a mode.
*/

(function() {

  angular.module('cs.directives').directive('aceEditor', function($timeout) {
    var definition;
    definition = {
      replace: true,
      template: "<div/>",
      link: function(scope, element, attrs) {
        /*
              Apply a nested value..
        */
        var applyValue, attachResizeEvents;
        applyValue = function(obj, property, value) {
          var nextProp, props;
          if (!(obj != null)) {
            throw "Cannot apply to null object the property:  " + property + " with value: " + value;
          }
          if (property.indexOf(".") === -1) {
            obj[property] = value;
          } else {
            props = property.split(".");
            nextProp = props.shift();
            applyValue(obj[nextProp], props.join("."), value);
          }
          return null;
        };
        /* 
        # Attach a listener for events that need to trigger a resize of the editor.
        # @param events
        */
        attachResizeEvents = function(events) {
          var event, eventsArray, _i, _len;
          eventsArray = events.split(",");
          for (_i = 0, _len = eventsArray.length; _i < _len; _i++) {
            event = eventsArray[_i];
            scope.$on(event, function() {
              return $timeout(function() {
                return scope.editor.resize();
              });
            });
          }
          return null;
        };
        return $timeout(function() {
          var AceMode, initialData, mode;
          if (attrs["aceResizeEvents"] != null) {
            attachResizeEvents(attrs["aceResizeEvents"]);
          }
          scope.editor = ace.edit(element[0]);
          scope.editor.setTheme("ace/theme/" + attrs["aceTheme"]);
          mode = attrs["aceMode"];
          AceMode = require('ace/mode/' + mode).Mode;
          scope.editor.getSession().setMode(new AceMode());
          scope.aceModel = attrs["aceModel"];
          initialData = scope.$eval(scope.aceModel);
          scope.editor.getSession().setValue(initialData);
          return scope.editor.getSession().on("change", function() {
            var newValue;
            newValue = scope.editor.getSession().getValue();
            return applyValue(scope, scope.aceModel, newValue);
          });
        }, 250);
      }
    };
    return definition;
  });

}).call(this);

/*
infinite scrolling module
Triggers a callback to the scope.
Usage: 
<div when-scrolled="doSomething()"/>
*/

(function() {

  angular.module('cs.directives').directive('whenScrolled', function() {
    var fn;
    fn = function(scope, elm, attr) {
      var funCheckBounds, raw;
      raw = elm[0];
      funCheckBounds = function() {
        var rectObject;
        rectObject = raw.getBoundingClientRect();
        if (rectObject.height === 0) return;
        if (rectObject.bottom <= window.innerHeight) {
          scope.$apply(attr.whenScrolled);
        }
        return null;
      };
      return angular.element(window).bind('scroll', funCheckBounds);
    };
    return fn;
  });

}).call(this);
