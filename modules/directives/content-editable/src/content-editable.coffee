# ContentEditable
# Adds the html5 'contenteditable' attribute to the node
# Attributes:
# - ngModel = the text to bind to (two way)
# - validateChange = an optional validate change function that is passed 2 parameters:
# -- 1. the changed text
# -- 2. the content-id - an angular expression {{}} in which you can put a plain string or a binding
# -- 3. callback - a callback into the directive
# -- -- The callback should be passed a boolean
# - contentId = an optional id for the validateChange function
angular.module('cs.directives')
.directive('contentEditable', ->
  ENTER_KEY = 13
  TAB_KEY = 9

  definition =
    restrict: 'A',
    require: 'ngModel',

    scope:
      ngModel:'=',
      contentId: '@',
      validateChange:'&'


    link: ($scope, $element, $attrs) ->

      $element.attr('contenteditable', '')

      $scope.$watch 'ngModel', (newValue) ->
        $element.html($scope.ngModel)
        null

      $scope.onValidationResult = (success) ->
        if success
          $scope.ngModel = $element.html()
        null

      # Delegate validation callback if it exists - this in turn fill invoke:
      # onValidationResult(true|false) - where we proceed with the update.
      processChange = (text) ->
        if $scope.validateChange and $attrs.validateChange
          $scope.validateChange({ text: text, id: $scope.contentId, callback: $scope.onValidationResult})
        else
          $scope.onValidationResult(true)

      $element.bind 'keydown', (event) ->
        if event.which == ENTER_KEY or event.which == TAB_KEY
          change = $element.html()

          processChange(change)
          $element.blur()
        null

      $element.bind 'blur', ->
        $element.html($scope.ngModel)
        null

  definition
)