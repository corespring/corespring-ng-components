###
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
###

angular.module('cs.directives').directive('aceEditor', ($timeout) -> 
  definition = 
    replace: true
    template: "<div/>"
    link: (scope, element, attrs) -> 

      ###
      Apply a nested value..
      ###
      applyValue = (obj, property, value) ->
        if !obj?
          throw "Cannot apply to null object the property:  " + property + " with value: " + value 

        if property.indexOf(".") == -1 
          obj[property] = value
        else
          props = property.split(".")
          nextProp = props.shift()
          applyValue(obj[nextProp], props.join("."), value )
        null
      
      ### 
      # Attach a listener for events that need to trigger a resize of the editor.
      # @param events
      ### 
      attachResizeEvents = ( events ) ->
        eventsArray = events.split(",")

        for event in eventsArray 
          scope.$on event, -> 
            $timeout ->
              scope.editor.resize()
        null

      $timeout( -> 
        if attrs["aceResizeEvents"]? 
          attachResizeEvents(attrs["aceResizeEvents"])

        scope.editor = ace.edit(element[0])
        scope.editor.setTheme("ace/theme/" + attrs["aceTheme"])

        mode = attrs["aceMode"]
        AceMode = require('ace/mode/' + mode).Mode
        scope.editor.getSession().setMode(new AceMode())

        scope.aceModel = attrs["aceModel"]
        initialData = scope.$eval( scope.aceModel)

        scope.editor.getSession().setValue(initialData)

        scope.editor.getSession().on "change", -> 
          newValue = scope.editor.getSession().getValue()
          applyValue(scope, scope.aceModel, newValue)
      , 250)
  definition
)

