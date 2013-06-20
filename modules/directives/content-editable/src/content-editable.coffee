# ContentEditable
# Adds the html5 'contenteditable' attribute to the node
# Attributes:
# - ngModel = the text to bind to (two way)
# - validate = an optional callback function that is passed 2 parameters:
# -- 1. the changed text
# -- 2. the content-id
# -- returns true/false
# - contentId = an optional id for the validate function
angular.module('cs.directives')
.directive('contentEditable', ->
  ENTER_KEY = 13
  definition =
    restrict: 'A',
    require: 'ngModel',
    scope:
      ngModel:'=',
      validate:'&'

    link: ($scope, $element, $attrs) ->
      $element.attr('contenteditable', '')

      $scope.$watch 'ngModel', (newValue) ->
        $element.html($scope.ngModel)
        null

      # Delegate validation callback if it exists
      isValid = (text) ->
        if $scope.validate and $attrs.validate
          $scope.validate({ text: text, id: $attrs.contentId})
        else
          true

      $element.bind 'keydown', (event) ->
        if event.which == ENTER_KEY
          change = $element.html()

          $scope.$apply ->
            $scope.ngModel = change if isValid(change)

          $element.blur()
        null

      $element.bind 'blur', ->
        $element.html($scope.ngModel)
        null

  definition
)