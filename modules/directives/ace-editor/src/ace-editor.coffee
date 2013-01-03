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
@param ace-resize-events - a comma delimited list of ng events that that should trigger a resize
@param ace-theme - an ace theme - loads them using "ace/theme/" + the them you specify. (you need to include the js for it)
@param ace-mode - an ace mode - as above loads a mode.
###

angular.module('cs.directives').directive('aceEditor', ['$timeout', 'Utils', ($timeout, Utils) -> 
  definition = 
    replace: true
    template: "<div/>"
    link: (scope, element, attrs) -> 

      applyValue = Utils.applyValue

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
              if scope.aceModel? 
                scope.editor.getSession().setValue( scope.$eval(scope.aceModel ))
        null


      onExceptionsChanged = (newValue, oldValue) ->

        if oldValue?
          for exception in oldValue
            scope.editor.renderer.removeGutterDecoration (exception.lineNumber - 1), "ace_failed"
        if newValue?
          for exception in newValue
            scope.editor.renderer.addGutterDecoration (exception.lineNumber - 1), "ace_failed" 

        null

      if attrs["aceResizeEvents"]? 
        attachResizeEvents(attrs["aceResizeEvents"])

      if attrs["aceExceptions"]?
        scope.$watch(attrs["aceExceptions"], onExceptionsChanged)

      scope.editor = ace.edit(element[0])
      scope.editor.getSession().setUseWrapMode(true)

      theme = attrs["aceTheme"] || "eclipse"
      scope.editor.setTheme("ace/theme/" + theme )

      scope.$watch attrs["aceMode"], (newValue,oldValue) ->
        return if !newValue?
        return if !scope.editor?

        newValue = "javascript" if newValue == "js"
        modeFactory = require("ace/mode/#{newValue}")
        return if !modeFactory?
          
        AceMode = modeFactory.Mode
        scope.editor.getSession().setMode(new AceMode())
        null

      #mode = attrs["aceMode"] || "xml"

      scope.aceModel = attrs["aceModel"]

      scope.$watch scope.aceModel, (newValue, oldValue) ->
        if scope.changeFromEditor
          return 

        #console.log "new value: " + newValue 
        $timeout ->
          scope.suppressChange = true 
          scope.editor.getSession().setValue( newValue )
          scope.suppressChange = false 
          null
        null

      initialData = scope.$eval(scope.aceModel)


      scope.editor.getSession().setValue(initialData)

      scope.editor.getSession().on "change", -> 

        if scope.suppressChange
          return

        scope.changeFromEditor = true

        newValue = scope.editor.getSession().getValue()
        applyValue(scope, scope.aceModel, newValue)
        scope.changeFromEditor = false
        null


  definition
])

